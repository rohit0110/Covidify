// SELECT ALL ELEMENTS
const country_name_element = document.querySelector(".country .name");
const total_cases_element = document.querySelector(".total-cases .value");
const new_cases_element = document.querySelector(".total-cases .new-value");
const recovered_element = document.querySelector(".recovered .value");
const new_recovered_element = document.querySelector(".recovered .new-value");
const deaths_element = document.querySelector(".deaths .value");
const new_deaths_element = document.querySelector(".deaths .new-value");

const ctx = document.getElementById("axes_line_chart").getContext("2d");
// const ctx1= document.getElementById("axes_line_chart2").getContext("2d");

// APP VARIABLES
let app_data = [],
  cases_list = [],
  cases_each_day = [],
  recovered_list = [],
  recovered_each_day = [],
  deaths_list = [],
  deaths_each_day = [],
  deaths = [],
  formatedDates = [];

// GET USERS COUNTRY CODE
let user_country = "India";
// let user_country;
// country_list.forEach((country) => {
//   if (country.code == country_code) {
//     user_country = country.name;
//   }
// });

function fetchData(country) {
  user_country = country;
  country_name_element.innerHTML = "Loading...";

  (cases_list = []),
    (recovered_list = []),
    (recovered_each_day = []),
    (deaths_each_day = []),
    (cases_each_day = []),
    (deaths_list = []),
    (dates = []),
    (formatedDates = []);

  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const api_fetch = async (country) => {
    await fetch(
      "https://api.covid19api.com/total/country/" +
        country +
        "/status/confirmed",
      requestOptions
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        data.forEach((entry) => {
          dates.push(entry.Date);
          cases_list.push(entry.Cases);
        });
      });

    await fetch(
      "https://api.covid19api.com/total/country/" +
        country +
        "/status/recovered",
      requestOptions
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        data.forEach((entry) => {
          recovered_list.push(entry.Cases);
        });
      });

    await fetch(
      "https://api.covid19api.com/total/country/" + country + "/status/deaths",
      requestOptions
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        data.forEach((entry) => {
          deaths_list.push(entry.Cases);
        });
      });

    updateUI();
  };

  api_fetch(country);
}

fetchData(user_country);

// UPDATE UI FUNCTION
function updateUI() {
  updateStats();
  axesLinearChart();
  // axesLinearChart2();
}

function updateStats() {
  const total_cases = cases_list[cases_list.length - 1];
  const new_confirmed_cases = total_cases - cases_list[cases_list.length - 2];

  const total_recovered = recovered_list[recovered_list.length - 1];
  const new_recovered_cases =
    total_recovered - recovered_list[recovered_list.length - 2];

  const total_deaths = deaths_list[deaths_list.length - 1];
  const new_deaths_cases = total_deaths - deaths_list[deaths_list.length - 2];

  country_name_element.innerHTML = user_country;
  total_cases_element.innerHTML = total_cases;
  new_cases_element.innerHTML = `+${new_confirmed_cases}`;
  recovered_element.innerHTML = total_recovered;
  new_recovered_element.innerHTML = `+${new_recovered_cases}`;
  deaths_element.innerHTML = total_deaths;
  new_deaths_element.innerHTML = `+${new_deaths_cases}`;

  // format dates
  dates.forEach((date) => {
    formatedDates.push(formatDate(date));
  });
  var i=1;
  cases_each_day.push(cases_list[0]);
  for(i=1;i<cases_list.length;i++) {
    cases_each_day.push(cases_list[i]-cases_list[i-1]);
  }
  recovered_each_day.push(recovered_list[0]);
  for(i=1;i<recovered_list.length;i++) {
    recovered_each_day.push(recovered_list[i]-recovered_list[i-1]);
  }
  deaths_each_day.push(deaths_list[0]);
  for(i=1;i<deaths_list.length;i++) {
    deaths_each_day.push(deaths_list[i]-deaths_list[i-1]);
  }
}

// UPDATE CHART
let my_chart;
function axesLinearChart() {
  if (my_chart) {
    my_chart.destroy();
  }

  my_chart = new Chart(ctx, {
    type: "bar",
    data: {
      datasets: [
        {
          label: "Cases",
          data: cases_list,
          fill: false,
          borderColor: "#FFF",
          backgroundColor: "#FFF",
          borderWidth: 1,
        },
        {
          label: "Cases Each Day",
          data: cases_each_day,
          fill: false,
          borderColor: "#0eaaec",
          backgroundColor: "#0eaaec",
          borderWidth: 1,
        },
        {
          label: "Recovered",
          data: recovered_list,
          fill: false,
          borderColor: "#0DFA08",
          backgroundColor: "#0DFA08",
          borderWidth: 1,
        },
        {
          label: "Recovered Each Day",
          data: recovered_each_day,
          fill: false,
          borderColor: "#13EA7D",
          backgroundColor: "#13EA7D",
          borderWidth: 1,
        },
        {
          label: "Deaths",
          data: deaths_list,
          fill: false,
          borderColor: "#FA0813",
          backgroundColor: "#FA0813",
          borderWidth: 1,
        },
        {
          label: "Deaths Each Day",
          data: deaths_each_day,
          fill: false,
          borderColor: "#EA8513",
          backgroundColor: "#EA8513",
          borderWidth: 1,
        },
      ],
      labels: formatedDates,
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
    },
  });
}

// let my_chart2;
// function axesLinearChart2() {
//   if (my_chart2) {
//     my_chart2.destroy();
//   }
// console.log([cases_each_day.length,cases_list.length]);
//   my_chart2 = new Chart(ctx1, {
//     type: "doughnut",
//     data: {
//       datasets: [{
//         data:[cases_list[cases_list.length-1]-(recovered_list[recovered_list.length-1] + deaths_list[deaths_list.length-1]),recovered_list[recovered_list.length-1],deaths_list[deaths_list.length-1]],
//       backgroundColor: [
//         "#FFF",
//         "#0DFA08",
//         "#FA0813",
//       ],
//       borderColor:[
//         "#0eaaec",
//         "#0DFA08",
//         "#FA0813",
//       ]
//       }],
//       labels: [
//         'Active Cases',
//         'Recovered',
//         'Deaths',
//       ],
//     },
//     options: {
//       layout: {
//           padding: {
//               left: 50,
//               right: 0,
//               top: 0,
//               bottom: 0
//           }
//       }
//       // animateRotate: true
//   }
//   });
// }

// FORMAT DATES
const monthsNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDate(dateString) {
  let date = new Date(dateString);

  return `${date.getDate()} ${monthsNames[date.getMonth() - 1]}`;
}
