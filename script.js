document.getElementById("athleteForm").addEventListener("submit", addAthlete);
document
  .getElementById("generateMatches")
  .addEventListener("click", generateMatches);

let athletes = [];

function addAthlete(event) {
  event.preventDefault();
  const name = document.getElementById("athleteName").value;
  const team = document.getElementById("athleteTeam").value;

  athletes.push({ name, team });

  document.getElementById("athleteName").value = "";
  document.getElementById("athleteTeam").value = "";

  renderAthleteList();
}

function renderAthleteList() {
  const athleteList = document.getElementById("athleteList");
  athleteList.innerHTML = "";
  athletes.forEach((athlete, index) => {
    const li = document.createElement("li");
    li.textContent = `${athlete.name} (${athlete.team})`;
    athleteList.appendChild(li);
  });
}

function generateMatches() {
  if (athletes.length < 3 || athletes.length > 25) {
    alert("Số lượng vận động viên phải từ 3 đến 25.");
    return;
  }

  const totalAthletes = athletes.length;
  let n = Math.floor(Math.log2(totalAthletes));
  const maxPowerOf2 = 2 ** n;

  let x;
  if (totalAthletes === maxPowerOf2) {
    x = totalAthletes;
  } else {
    x = (totalAthletes - maxPowerOf2) * 2;
  }

  let round1Athletes = athletes.slice(0, x);
  let remainingAthletes = athletes.slice(x);

  round1Athletes = shuffleAndAvoidSameTeam(round1Athletes);
  remainingAthletes = shuffleAndAvoidSameTeam(remainingAthletes);

  const matchList = document.getElementById("matchList");
  matchList.innerHTML = "";

  createMatches(round1Athletes, matchList);

  // Thêm các vận động viên không phải thi đấu vòng đầu vào danh sách
  remainingAthletes.forEach((athlete) => {
    const li = document.createElement("li");
    li.textContent = `${athlete.name} (${athlete.team}) không phải thi đấu vòng này`;
    matchList.appendChild(li);
  });
}

function shuffleAndAvoidSameTeam(athleteArray) {
  let shuffled = athleteArray.sort(() => 0.5 - Math.random());

  // Cố gắng tránh ghép cặp vận động viên cùng đoàn
  for (let i = 0; i < shuffled.length - 1; i += 2) {
    if (shuffled[i].team === shuffled[i + 1].team) {
      // Tìm vị trí để đổi
      for (let j = i + 2; j < shuffled.length; j++) {
        if (
          shuffled[j].team !== shuffled[i].team &&
          shuffled[j].team !== shuffled[i + 1].team
        ) {
          [shuffled[i + 1], shuffled[j]] = [shuffled[j], shuffled[i + 1]];
          break;
        }
      }
    }
  }

  return shuffled;
}

function createMatches(athleteArray, matchList) {
  for (let i = 0; i < athleteArray.length - 1; i += 2) {
    const li = document.createElement("li");
    li.textContent = `${athleteArray[i].name} (${athleteArray[i].team}) vs ${
      athleteArray[i + 1].name
    } (${athleteArray[i + 1].team})`;
    matchList.appendChild(li);
  }

  // Nếu số lượng vận động viên lẻ, người cuối cùng sẽ được thông báo
  if (athleteArray.length % 2 !== 0) {
    const li = document.createElement("li");
    li.textContent = `${athleteArray[athleteArray.length - 1].name} (${
      athleteArray[athleteArray.length - 1].team
    }) không có đối thủ vòng này`;
    matchList.appendChild(li);
  }
}
