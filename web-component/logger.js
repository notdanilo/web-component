class Logger {
    constructor(namespace) {
        this.namespace = namespace
    }

    sub(namespace) {
        return new Logger(`${this.namespace}.${namespace}`)
    }

    make(message) {
        return `[${this.namespace}] ${message}`;
    }

    info(message) {
        console.info(this.make(message));
    }

    warn(message) {
        console.warn(this.make(message));
    }
}

export let logger = new Logger("web-component");
