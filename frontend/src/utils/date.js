export const formatDate = (dateString)=>{
    const date = new Date(dateString);
    if (isNaN(date.getTime())){
        return "Invalid Date";
    }
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    })
}