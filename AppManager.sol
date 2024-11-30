// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.25;

contract AppManager {

    // TOS config
    struct Tos {
        bytes16 id;
        string name;
        string logo;
        string website;
        string description;
        address creater;
        uint16 vcpus;
        uint16 vmemory;
        uint64 disk;
        string version;
        bytes code;
        bytes20[] vm_ids;
        TosStatus status;
    }

    enum OperatorType {
        TDX,
        H100,
        A100,
        CPU
    }

    struct TCBInfo {
        string roots_hash;
        string mrtd;
        string rtmr0;
        string rtmr1;
        string rtmr2;
        string rtmr3;
    }

    struct Event_log {
        uint8 imr;
        uint64 event_type;
        string digest;
        string event_name;
        string event_payload;
    }

    struct VmReport {
        string app_id;
        TCBInfo tcb;
        bytes certificate;
    }

    enum VmStatus {
        Waiting,
        Active
    }

    enum TosStatus {
        Waiting,
        Active
    }

    struct Vm {
        bytes20 id;
        address creater;
        address operator;
        VmStatus status;
    }

    struct Operator {
        bool is_operator;
        uint64 port;
        OperatorType operator_type;
        uint256 create_time;
        string base_domain;
        string name;
        bytes20[] vm_ids;
    }

    // Registered TOSs
    mapping(bytes16 => Tos) toss;
    uint128 public total_toss;

    // Registered CVMs
    mapping(bytes20 => Vm) vms;
    uint128 public total_vms;

    // Registered Operators
    mapping(address => Operator) operators;
    address[] public registerd_operators;  // 记录总的Operators数量

    // 标记用户所启动的app
    mapping(bytes20 => VmReport) vm_reports;

    event CreateTOS(
        bytes16 id,
        string name,
        string logo,
        string website,
        string description,
        uint16 vcpus,
        uint16 vmemory,
        uint64 disk,
        string version,
        bytes code
    );

    event RegisterVM(address indexed creater, bytes20 indexed vm_id);
    event RegisterOperator(address indexed operator);

    modifier OperatorNotRegister() {
        require(!operators[msg.sender].is_operator, "Operator Already Register");
        _;
    }

    modifier OperatorRegister() {
        require(operators[msg.sender].is_operator, "Operator Not Register");
        _;
    }

    function is_register(address target) public view returns (bool) {
        return operators[target].is_operator;
    }

    function get_vm(bytes20 id) external view returns (Vm memory) {
        return vms[id];
    }

    function get_tos(bytes16 id) external view returns (Tos memory) {
        return toss[id];
    }

    function get_operator(address target) external view returns (Operator memory) {
        return operators[target];
    }

    function get_app_report(bytes20 target) external view returns (VmReport memory) {
        return vm_reports[target];
    }

    /** @dev register_operator: Register an operator
        - name: the name of the operator
        - operator_type: the type of the operator, e.g. TDX, H100, A100, CPU
        - base_domain: the base domain of the operator
        - port: the port of the operator
    */
    function register_operator(
        string calldata name,
        OperatorType operator_type,
        string calldata base_domain,
        uint64 port
    )
        external
        OperatorNotRegister
    {
        operators[msg.sender] = Operator({
            name: name,
            base_domain: base_domain,
            operator_type: operator_type,
            port: port,
            create_time: block.timestamp,
            is_operator: true,
            vm_ids: new bytes20[](0)
        });

        registerd_operators.push(msg.sender);

        emit RegisterOperator(msg.sender);
    }

    function total_operator() public view returns (uint256) {
        return registerd_operators.length;
    }

    function get_operator_by_index(uint256 index) public view returns (Operator memory) {
        require(index < registerd_operators.length, "Index out of bounds");
        return operators[registerd_operators[index]];
    }

    // function get_tos_by_index(uint128 index) public view returns (Tos memory) {
    //     require(index <= total_toss, "Index out of bounds");
    //     return toss[index];
    // }

    function next_tos() internal returns (uint128) {
        uint128 index = total_toss + 1;
        total_toss = index;
        return index;
    }

    function next_vm() internal returns (uint128) {
        uint128 index = total_vms + 1;
        total_vms = index;
        return index;
    }

    /** @dev create_tos: Create a TOS
        - name: the name of the TOS
        - operator_type: the type of the operator, e.g. TDX, H100, A100, CPU
        - vcpus: the number of vcpus
        - vmemory: the memory size
        - disk: the disk size
        - version: the version of the TOS
        - description: the description of the TOS
    */
    function create_tos(
        string calldata name,
        string calldata logo,
        string calldata website,
        OperatorType operator_type,
        uint16 vcpus,
        uint16 vmemory,
        uint64 disk,
        string calldata version,
        string calldata description,
        bytes memory docker_compose
    )
        external
        returns (uint128)
    {
        uint128 index = next_tos();
        bytes16 id = bytes16(index);
        toss[id] = Tos({
            id: id,
            name: name,
            logo: logo,
            website: website,
            description: description,
            vcpus: vcpus,
            vmemory: vmemory,
            disk: disk,
            creater: msg.sender,
            version: version,
            code: docker_compose,
            vm_ids: new bytes20[](0),
            status: TosStatus.Waiting
        });

        emit CreateTOS(id, name, logo, website, description, vcpus, vmemory, disk, version, docker_compose);

        return index;
    }

    function is_valid_operator(address operator, OperatorType operator_type) public view returns (bool) {
        Operator memory op = operators[operator];
        return op.is_operator && op.operator_type == operator_type;
    }

    /** @dev register_vm: Register a CVM into an registerd TOS
        - tos_id: the id of the TOS
        - app_id: the app id generated by dstack
        - vm_id: the instance id generated by dstack
        - tcb: the tcb of the cvm
        - certificate: the certificate of the cvm
    */
    function register_vm(
        bytes16 tos_id,  // not necessarily the same as or related to the app_id
        string calldata app_id,  
        bytes20 vm_id,
        TCBInfo calldata tcb,
        bytes calldata certificate
    )
        external
        OperatorRegister
    {
        // Ensure the instance is not registered
        require(vms[vm_id].creater == address(0), "Instance Already Registered");
        
        next_vm();
        vms[vm_id] = Vm({
            id: vm_id,
            creater: msg.sender,
            operator: msg.sender,
            status: VmStatus.Active
        });

        // register the vm to the target tos
        Tos storage tos = toss[tos_id];
        tos.vm_ids.push(vm_id);

        // register the vm to the operator who register this vm
        Operator storage op = operators[msg.sender];
        op.vm_ids.push(vm_id);

        Vm memory vm = vms[vm_id];
        
        // TODO: 检查certificate和tcb的关系，确认docker_compose的关系？

        // TODO: 检查ecdsa公钥？
        vm_reports[vm_id] = VmReport({ app_id: app_id, tcb: tcb, certificate: certificate });


        emit RegisterVM(vm.creater, vm.id);
    }

    function generate_random(address operator, uint256 index) internal view returns (bytes16) {
        bytes32 random = keccak256(abi.encodePacked(block.timestamp, block.number, operator, index));
        return bytes16(random);
    }

    function shrinkArray(bytes16[] memory src, uint256 new_length) internal pure returns (bytes16[] memory) {
        require(new_length != 0, "New length cannot be zero");
        require(new_length <= src.length, "New length must be less than or equal to the original length");

        if (new_length == src.length) {
            return src;
        }

        uint256 index = 0;
        bytes16[] memory target = new bytes16[](new_length);
        for (uint256 i = 0; i < src.length; i++) {
            if (src[i] != bytes16(0)) {
                target[index] = src[i];
                index++;
            }
        }

        return target;
    }
}
