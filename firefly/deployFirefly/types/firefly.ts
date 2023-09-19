/** 1 - Deploy Contract Interface */
export type ContractDeployResponseType = {
    created: string;
    error: string;
    id: string;
    input: {
        [key: string]: string;
    };
    namespace: string;
    plugin: string;
    retry: string;
    status: string;
    tx: string;
    type: string;
    updated: string;
}
export interface ContractDeployOperationResponseType {
    id: string;
    namespace: string;
    tx: string;
    type: string;
    status: string;
    plugin: string;
    input: {
        contract: string;
        definition: any[];
        input: string[];
        key: string;
        options: any;
    };
    output: {
        contractLocation: {
            address: string;
        };
        headers: {
            requestId: string;
            type: string;
        };
        protocolId: string;
        transactionHash: string;
    };
    created: string;
    updated: string;
}

/** 2 - Generate Contract Interface */
export interface GenerateContractInterfaceBodyType {
    input: {
        abi: any;
    };
}
export interface GenerateContractInterfaceResponseType {
    id: string;
    name: string;
    namespace: string;
    version: string;
    description: string;
    message: string;
    methods: {
        description: string;
        details: { [key: string]: { description: string } };
        id: string;
        interface: string;
        name: string;
        namespace: string;
        params: ParamItem[];
        pathname: string;
        returns: ParamItem[];
    }[];
    events: {
        description: string;
        details: { [key: string]: { description: string } };
        id: string;
        interface: string;
        name: string;
        namespace: string;
        params: ParamItem[];
        pathname: string;
        signature: string;
    }[];
};
interface ParamItem {
    name: string;
    schema: { description: string };
}

/** 3 - Build Contract Interface to Firefly */

export interface BuildContractInterfaceBodyType {
    namespace: string;
    name: string;
    description: string;
    version: string;
    methods: any[];
    events: any[];
}
export interface BuildContractInterfaceResponseType {
    id: string;
    message: string;
    namespace: string;
    name: string;
    description: string;
    version: string;
    methods: {
        description: string;
        details: Record<string, { description: string }>;
        id: string;
        interface: string;
        name: string;
        namespace: string;
        params: {
            name: string;
            schema: {
                description: string;
            };
        }[];
        pathname: string;
        returns: {
            name: string;
            schema: {
                description: string;
            };
        }[];
    }[];
    events: {
        description: string;
        details: Record<string, { description: string }>;
        id: string;
        interface: string;
        name: string;
        namespace: string;
        params: {
            name: string;
            schema: {
                description: string;
            };
        }[];
        pathname: string;
        signature: string;
    }[];
}

/** 4 - Generate Contract API */

export interface GenerateContractAPIBodyType {
    name: string;
    interface: {
        id: string;
    };
    location: {
        address: string;
    };
}
export interface GenerateContractAPIResponseType {
    id: string;
    interface: {
        id: string;
        name: string;
        version: string;
    };
    location: {
        address: string;
        description: string;
    };
    message: string;
    name: string;
    namespace: string;
    urls: {
        openapi: string;
        ui: string;
    };
}

/** Generate Contract Event Listener */
export interface GenerateContractEventListenerBodyType {
    interface: {
        id: string;
    };
    location: {
        address: string;
    };
    eventPath: string;
    options: {
        firstEvent: string;
    };
    topic: string;
}

export interface GenerateContractEventListenerResponseType {
    backendId: string;
    created: string;
    event: {
        description: string;
        details: {
            [key: string]: {
                description: string;
            };
        };
        name: string;
        params: Array<{
            name: string;
            schema: {
                description: string;
            };
        }>;
    };
    id: string;
    interface: {
        id: string;
        name: string;
        version: string;
    };
    location: {
        description: string;
    };
    name: string;
    namespace: string;
    options: {
        firstEvent: string;
    };
    signature: string;
    topic: string;
}


export type GenerateContractEventSubscriptionBodyType = {
    namespace: string;
    name: string;
    transport: string;
    filter: {
        events: string;
        blockchainevent: {
            listener: string;
        };
    };
    options: {
        firstEvent: string;
    };
}

export type GenerateContractEventSubscriptionResponseType = {
    id: string;
    namespace: string;
    name: string;
    transport: string;
    filter: {
        events: string;
        message: Record<string, unknown>;
        transaction: Record<string, unknown>;
        blockchainevent: {
            listener: string;
        };
    };
    options: {
        firstEvent: string;
        withData: boolean;
    };
    created: string;
    updated: string | null;
}

export type EventSubscriptionParams = {
    topic: string,
    listenerID: string
}