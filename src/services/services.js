const Services = {
    showHoursMinutesSeconds(secs){
        var hours= "00:", 
            minutes= "00:", 
            seconds= "";
        seconds = secs % 60;

        if (seconds < 10){
            seconds = "0" + seconds;
        }
        if (secs >= 60){
            minutes = parseInt(secs / 60 % 60);
            if (minutes < 10){
                minutes = "0" + minutes;
            }
            minutes = minutes + ":"
        }
        if (secs >= 3600){
            hours = parseInt(secs / 3600);
            if (hours < 10){
                hours = "0" + hours;
            }
            hours = hours + ":"
        }
        return hours + minutes + seconds;
    }
};

export default Services;