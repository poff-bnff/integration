const ChannelId = 'C018L2CV5U4';


let data= {
  "id": 'develop-poff:c4367ef6-ab71-47a8-9790-6ed783d6a3fa',
  "buildNumber": 91,
  "startTime": 1602285279245,
  "initiator": 'GitHub-Hookshot/4772ab2',
  "commit": 'a3fadac76439edce75b4c2ca6f3634b0d05af471',
  "domain": 'poff.ee',
  "user": "U019U999QTG",
  "succeeding": 0
}

// tee date-iks
let timestamp = 1602260490903


date = new Date (timestamp * 1000)
var newDate = new Date();
newDate.setTime(timestamp*1000);
dateString = newDate.toUTCString();
//console.log(dateString)
//console.log(date)
datevalues = [
   date.getFullYear(),
   date.getMonth()+1,
   date.getDate(),
   date.getHours(),
   date.getMinutes(),
   date.getSeconds(),
];
//console.log(datevalues)

var date = new Date(timestamp);
let year = date.getFullYear()
let month = ("0" + (date.getMonth() + 1)).slice(-2)
let day = ("0" + date.getDate()).slice(-2)

var fdate = date.getFullYear() + '/' + ("0" + (date.getMonth() + 1)).slice(-2) + '/' + ("0" + date.getDate()).slice(-2);

console.log(fdate);
console.log(`${day}.${month}.${year}`)

let d = new Date(timestamp);
let days = ["esmaspäeval", "teisipäeval", "kolmapäeval", "neljapäeval", "reedel", "laupäeval", "pühapäeval"]
let months = ["jaanuaril", "veebruaril", "märtsil", "aprillil", "mail", "juunil", "juulil", "augusil", "septembril", "oktoobril", "novembril", "detsembril"];
// console.log(d.getDay())
console.log(`${days[d.getDay()]} ${d.getDate()}.${months[d.getMonth()]} kell ${d.getHours()}:${d.getMinutes()}`);

