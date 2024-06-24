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
  athletes.forEach((athlete) => {
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
  renderGraph(round1Athletes, remainingAthletes);

  remainingAthletes.forEach((athlete) => {
    const li = document.createElement("li");
    li.textContent = `${athlete.name} (${athlete.team}) không phải thi đấu vòng này`;
    matchList.appendChild(li);
  });
}

function shuffleAndAvoidSameTeam(athleteArray) {
  let shuffled = athleteArray.sort(() => 0.5 - Math.random());

  for (let i = 0; i < shuffled.length - 1; i += 2) {
    if (shuffled[i].team === shuffled[i + 1].team) {
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

  if (athleteArray.length % 2 !== 0) {
    const li = document.createElement("li");
    li.textContent = `${athleteArray[athleteArray.length - 1].name} (${
      athleteArray[athleteArray.length - 1].team
    }) không có đối thủ vòng này`;
    matchList.appendChild(li);
  }
}

function renderGraph(round1Athletes, remainingAthletes) {
  const canvas = document.getElementById("matchCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const startX = 50;
  const startY = 50;
  const boxWidth = 150;
  const boxHeight = 30;
  const margin = 10;
  const lineHeight = 70;

  let previousRoundWinners = [];

  // Vẽ các trận đấu vòng đầu tiên
  round1Athletes.forEach((athlete, index) => {
    const x = startX;
    const y = startY + index * (boxHeight + margin);
    drawBox(ctx, x, y, boxWidth, boxHeight, athlete.name);

    if (index % 2 === 1) {
      const prevY = startY + (index - 1) * (boxHeight + margin);
      const midX = x + boxWidth + margin;
      const midY = (prevY + y + boxHeight) / 2;
      drawLine(ctx, x + boxWidth, prevY + boxHeight / 2, midX, midY);
      drawLine(ctx, x + boxWidth, y + boxHeight / 2, midX, midY);
      drawBox(
        ctx,
        midX,
        midY - boxHeight / 2,
        boxWidth,
        boxHeight,
        "Người thắng"
      );
      previousRoundWinners.push({ x: midX, y: midY - boxHeight / 2 });
    }
  });

  // Vẽ các trận đấu tiếp theo với những vận động viên chưa thi đấu
  remainingAthletes.forEach((athlete, index) => {
    const winner = previousRoundWinners.shift(); // Lấy người thắng từ vòng trước
    const x = winner.x;
    const y = winner.y + boxHeight + margin;

    // Vẽ đường nối giữa người thắng và người chưa đấu
    drawLine(ctx, winner.x, winner.y + boxHeight, x, y - margin);

    // Vẽ ô "Người chưa đấu"
    drawBox(ctx, x, y, boxWidth, boxHeight, athlete.name);

    // Vẽ ô "Người thắng" cho trận đấu này
    const nextX = x + boxWidth + margin;
    const midY = y - boxHeight / 2 - margin / 2;
    drawLine(ctx, x + boxWidth, y + boxHeight / 2, nextX, midY + boxHeight / 2);
    drawBox(ctx, nextX, midY, boxWidth, boxHeight, "Người thắng");

    previousRoundWinners.push({ x: nextX, y: midY });
  });
}

function drawBox(ctx, x, y, width, height, text) {
  ctx.fillStyle = "#007bff";
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = "#fff";
  ctx.font = "14px Arial";
  ctx.fillText(text, x + 5, y + 20);
  ctx.strokeStyle = "#000";
  ctx.strokeRect(x, y, width, height);
}

function drawLine(ctx, x1, y1, x2, y2) {
  ctx.strokeStyle = "#000";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
