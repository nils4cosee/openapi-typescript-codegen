'use strict';

const generate = require('./scripts/generate');
const compileWithTypescript = require('./scripts/compileWithTypescript');
const {customClient} = require("./scripts/custom-client");

describe('v3.custom', () => {

    beforeAll(async () => {
        await generate('v3/custom', 'v3', 'custom');
        compileWithTypescript('v3/custom');
        const {CustomHttpClient} = require('./generated/v3/custom/core/request')
        CustomHttpClient.executeRequest = customClient;
    },30000);

    it('requests token', async () => {

        const { OpenAPI, SimpleService } = require('./generated/v3/custom/index.js');
        const tokenRequest = jest.fn().mockResolvedValue('MY_TOKEN')
        OpenAPI.TOKEN = tokenRequest;

        const result = await SimpleService.getCallWithoutParametersAndResponse();
        expect(tokenRequest.mock.calls.length).toBe(1);
        expect(result.headers.authorization).toBe('Bearer MY_TOKEN');
    });

    it('complexService', async () => {
        const { ComplexService } = require('./generated/v3/custom/index.js');
        const result = await ComplexService.complexTypes({
            first: {
                second: {
                    third: 'Hello World!'
                }
            }
        });
        expect(result).toBeDefined();
    });

});


