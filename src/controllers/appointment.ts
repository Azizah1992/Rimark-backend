export function createAppointmentController(appointments: any[], newappointments: any) {
    const appointmentsIndex = appointments.findIndex((el) => el.id === newappointments.id);
    if (appointmentsIndex === -1) {
        appointments.push(newappointments);
    } else {
        appointments[appointmentsIndex] = { // when creat update it will tack some information from the last array 
            ...appointments[appointmentsIndex],
            ...newappointments,
        };
    }
    return appointments;
}
