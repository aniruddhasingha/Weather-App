import { expect } from 'chai';
import sinon from 'sinon';
import axios, { AxiosStatic } from 'axios'; // Import AxiosStatic for stubbing
import geocode, { GeocodeData } from '../../utils/geocode'; // Ensure path is correct

describe('geocode', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should return geocode data for a valid address', (done) => {
        const mockAddress = 'Test Address';
        const mockResponse = {
            data: { // This is how axios wraps the response
                features: [
                    {
                        center: [-73.985130, 40.758896], // longitude, latitude
                        place_name: 'Times Square, New York, NY, USA'
                    }
                ]
            }
        };
        const expectedUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(mockAddress)}.json?access_token=pk.eyJ1Ijoiamlkb3NpbmdoYSIsImEiOiJjanpibDEzaTgwMjBlM25teGNreWg4bDMyIn0.e3_OZrASyNPDl1yW8V40ow&limit=1`;

        // Stub axios.get - need to cast axios to AxiosStatic for stubbing if not already typed so
        const axiosGetStub = sinon.stub(axios as AxiosStatic, 'get').resolves(mockResponse);

        geocode(mockAddress, (error?: string, data?: GeocodeData) => {
            expect(error).to.be.undefined;
            expect(data).to.deep.equal({
                latitude: 40.758896,
                longitude: -73.985130,
                location: 'Times Square, New York, NY, USA'
            });
            sinon.assert.calledOnceWithExactly(axiosGetStub, expectedUrl);
            done();
        });
    });

    it('should return an error if location is not found', function(done) { // Use function for this.timeout
        this.timeout(5000); // Increase timeout to 5 seconds
        const mockAddress = 'Unknown Address';
        const mockResponse = {
            data: { features: [] }
        };
        const expectedUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(mockAddress)}.json?access_token=pk.eyJ1Ijoiamlkb3NpbmdoYSIsImEiOiJjanpibDEzaTgwMjBlM25teGNreWg4bDMyIn0.e3_OZrASyNPDl1yW8V40ow&limit=1`;
        const axiosGetStub = sinon.stub(axios as AxiosStatic, 'get').resolves(mockResponse);

        geocode(mockAddress, (error?: string, data?: GeocodeData) => {
            expect(error).to.equal('Unable to find the location. Try another search.');
            expect(data).to.be.undefined;
            sinon.assert.calledOnceWithExactly(axiosGetStub, expectedUrl);
            done();
        });
    });

    it('should return an error for a network issue (no response)', function(done) { // Use function for this.timeout
        this.timeout(5000); // Increase timeout to 5 seconds
        const mockAddress = 'Any Address';
        const networkError: any = new Error('Network error');
        networkError.request = {};
        networkError.isAxiosError = true; // Make it look like an AxiosError
        const expectedUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(mockAddress)}.json?access_token=pk.eyJ1Ijoiamlkb3NpbmdoYSIsImEiOiJjanpibDEzaTgwMjBlM25teGNreWg4bDMyIn0.e3_OZrASyNPDl1yW8V40ow&limit=1`;
        const axiosGetStub = sinon.stub(axios as AxiosStatic, 'get').rejects(networkError);

        geocode(mockAddress, (error?: string, data?: GeocodeData) => {
            try {
                expect(error).to.equal('Unable to connect to location services: No response received from server.');
                expect(data).to.be.undefined;
                sinon.assert.calledOnceWithExactly(axiosGetStub, expectedUrl);
                done(); // Signal success
            } catch (e: any) {
                done(e); // Signal failure
            }
        });
    });

    it('should return an error for a server-side API error (with response)', function(done) { // Use function for this.timeout
        this.timeout(5000); // Increase timeout to 5 seconds
        const mockAddress = 'Problematic Address';
        const apiError: any = new Error('API Error');
        apiError.response = {
            status: 500,
            data: { message: 'Server Error' }
        };
        apiError.isAxiosError = true; // Make it look like an AxiosError
        const expectedUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(mockAddress)}.json?access_token=pk.eyJ1Ijoiamlkb3NpbmdoYSIsImEiOiJjanpibDEzaTgwMjBlM25teGNreWg4bDMyIn0.e3_OZrASyNPDl1yW8V40ow&limit=1`;
        const axiosGetStub = sinon.stub(axios as AxiosStatic, 'get').rejects(apiError);

        geocode(mockAddress, (error?: string, data?: GeocodeData) => {
            try {
                expect(error).to.equal('Unable to connect to location services: Server responded with status 500. Message: Server Error');
                expect(data).to.be.undefined;
                sinon.assert.calledOnceWithExactly(axiosGetStub, expectedUrl);
                done(); // Signal success
            } catch (e: any) {
                done(e); // Signal failure
            }
        });
    });
});
