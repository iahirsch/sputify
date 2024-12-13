import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getArtist } from '../api/getArtist.js';

describe('getArtist', () => {
    
    let localStorageMock;

    beforeEach(() => {
        localStorageMock = {
            getItem: vi.fn(),
        };
        global.localStorage = localStorageMock;
        // checks console output
        vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should return null if access token is missing', async () => {
        localStorage.getItem.mockReturnValue(null);
        const artist = await getArtist('id');
        expect(artist).toBeNull();
        expect(console.error).toHaveBeenCalledWith('Access token is undefined');
    });

    it('should return null if fetch fails', async () => {
        localStorage.getItem.mockReturnValue('mock-access-token');
        global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
        const artist = await getArtist('id');
        expect(artist).toBeNull();
        expect(console.error).toHaveBeenCalledWith('Error fetching Artist:', expect.any(Error));
    });

    it('should return null if response is not valid', async () => {
        localStorage.getItem.mockReturnValue('mock-access-token');
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
        });

        const artist = await getArtist('id');
        expect(artist).toBeNull();
        expect(console.warn).toHaveBeenCalledWith('Artist with ID id not found.');
    });

    it('should return artist data if fetch is successful', async () => {
        const mockArtist = { id: 'id', name: 'Mock Artist' };
        localStorage.getItem.mockReturnValue('mock-access-token');
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(mockArtist),
        });

        const artist = await getArtist('id');
        expect(artist).toEqual(mockArtist);
    });

    it('should return null if no id is provided, even with a valid token', async () => {
        localStorage.getItem.mockReturnValue('mock-access-token'); 
        const artist = await getArtist(); 
        expect(artist).toBeNull();
        expect(console.error).toHaveBeenCalledWith('Error: Artist ID is required');
    });    
    
});
