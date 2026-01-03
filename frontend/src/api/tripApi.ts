import axiosInstance from './axiosInstance';

export async function createTrip(tripData: any) {
    const response = await axiosInstance.post('trips/', tripData);
    return response.data;
}

export async function getTrips() {
    const response = await axiosInstance.get('trips/');
    return response.data;
}

export async function getTripById(id: string) {
    const response = await axiosInstance.get(`trips/${id}/`);
    return response.data;
}
