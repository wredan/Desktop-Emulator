function updateDateTime(){
    let now = new Date();
    let date = now.toLocaleDateString([], { 
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    let time = now.toLocaleTimeString([], {
        hour: "2-digit", 
        minute: "2-digit"
    })
    $('.clock').text(date + "\n" + time);
    setTimeout(updateDateTime, (60-now.getSeconds()) * 1000)
}

updateDateTime();