'use strict';

const { Contract } = require('fabric-contract-api');

class MedicineContract extends Contract {

    async createMedicine(ctx, batchId, name, manufacturer, expiry) {

        if (!batchId || batchId.trim() === "") {
            throw new Error("Invalid batchId");
        }

        if (!name || !manufacturer) {
            throw new Error("Invalid medicine details");
        }

        if (!expiry || isNaN(Date.parse(expiry))) {
            throw new Error("Invalid expiry date");
        }

        const medicine = {
            batchId,
            name,
            manufacturer,
            owner: manufacturer,
            expiry,
            status: "Manufactured",
            scanCount: 0,
            lastScannedLocation: "",
            history: []
        };

        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(medicine)));
        return JSON.stringify(medicine);
    }

    async readMedicine(ctx, batchId) {
        const data = await ctx.stub.getState(batchId);

        if (!data || data.length === 0) {
            throw new Error("Medicine not found");
        }

        return data.toString();
    }

    async transferMedicine(ctx, batchId, newOwner) {
        const data = await ctx.stub.getState(batchId);

        if (!data || data.length === 0) {
            throw new Error("Medicine not found");
        }

        if (!newOwner || newOwner.trim() === "") {
            throw new Error("Invalid new owner");
        }

        const medicine = JSON.parse(data.toString());

        medicine.owner = newOwner;
        medicine.status = "Transferred";

        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(medicine)));
    }

    async updateScan(ctx, batchId, location) {
        const data = await ctx.stub.getState(batchId);

        if (!data || data.length === 0) {
            throw new Error("Medicine not found");
        }

        if (!location || location.trim() === "") {
            throw new Error("Invalid location");
        }

        const medicine = JSON.parse(data.toString());

        medicine.scanCount = (medicine.scanCount || 0) + 1;
        medicine.lastScannedLocation = location;

        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(medicine)));
    }

    async getHistory(ctx, batchId) {
        const iterator = await ctx.stub.getHistoryForKey(batchId);
        const history = [];

        while (true) {
            const res = await iterator.next();

            if (res.value) {
                history.push(res.value.value.toString('utf8'));
            }

            if (res.done) {
                await iterator.close();
                return JSON.stringify(history);
            }
        }
    }
}
/// For testing purposes, we export the contract class directly
module.exports.contracts = [MedicineContract];