export const formatMonthYear = (month, year) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[Number(month) - 1]}, ${year}`;
};
export const formatTime = (value) => {
    if (!value) return "-";

    let date;
    // If only time comes: "15:00:00"
    if (/^\d{2}:\d{2}:\d{2}$/.test(value)) {
        const [hours, minutes] = value.split(":");
        date = new Date(0, 0, 0, hours, minutes);
    } else {
        // Full datetime: "2026-05-14T18:30:00.000Z"
        date = new Date(value);
    }
    return new Date(date).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};
export const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};


export const formatDateTime = (value) => {
    return `${formatDate(value)} ${formatTime(value)}`;
};