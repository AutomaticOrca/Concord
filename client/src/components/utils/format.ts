const monthAbbreviations = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const formatChatTime = (timestamp: string | number | Date): string => {
    const messageDate = new Date(timestamp);
    const today = new Date();

    const isToday =
        messageDate.getDate() === today.getDate() &&
        messageDate.getMonth() === today.getMonth() &&
        messageDate.getFullYear() === today.getFullYear();

    if (isToday) {
        return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // 只显示 HH:mm
    } else {
        const day = messageDate.getDate();
        const month = monthAbbreviations[messageDate.getMonth()];
        const year = messageDate.getFullYear().toString().slice(-2); // 取年份后两位

        return `${day}/${month}/${year}`;
    }
};
