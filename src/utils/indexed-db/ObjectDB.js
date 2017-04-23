class ObjectDB extends RawIndexedDB {
    constructor(tableName, type) {
        if (!type.cast) throw 'Type needs a .cast() method';
        super(tableName);
        this._type = type;
    }

    async key(obj) {
        if (!obj.hash) throw 'Object needs a .hash() method';
        return BufferUtils.toBase64(await obj.hash());
    }

    async get(key) {
        const value = await super.get(key);
        return this._type.cast(value);
    }

    async put(obj) {
        const key = await this.key(obj);
        await super.put(key, obj);
        return key;
    }

    async putRaw(key, obj) {
        await super.put(key, obj);
        return key;
    }

    async delete(obj) {
        const key = await this.key(obj);
        return await super.delete(key);
    }

}
