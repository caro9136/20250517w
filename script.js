const scheduleBody = document.getElementById("scheduleBody");
const generateBtn = document.getElementById("generateSchedule");
const resetBtn = document.getElementById("resetSchedule");
const customInput = document.getElementById("customHobbyInput");
const addHobbyBtn = document.getElementById("addHobbyBtn");

const startHour = 0; // 0시부터
const endHour = 24; // 24시까지 (마지막은 23:30)
const days = ["월", "화", "수", "목", "금", "토", "일"];
const hobbies = [
  "독서", "산책", "영화감상", "음악듣기", "요가", "그림그리기", "퍼즐맞추기", "글쓰기",
  "사진찍기", "명상", "게임", "요리", "플래너 정리", "친구와 수다", "스트레칭",
  "새로운 취미 배우기", "팟캐스트 듣기", "온라인 강의", "가벼운 운동", "식물 돌보기"
];

const colorMap = {};

function getRandomColor(word) {
  if (colorMap[word]) return colorMap[word];
  const hue = Math.floor(Math.random() * 360);
  const saturation = 70;
  const lightness = 60; // 좀 더 짙고 선명하게
  const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  colorMap[word] = color;
  return color;
}

function createScheduleTable() {
  scheduleBody.innerHTML = ""; // 초기화
  for (let hour = startHour; hour < endHour; hour++) {
    for (let half = 0; half < 2; half++) {
      if (hour === 23 && half === 1) break; // 23:30까지만

      const row = document.createElement("tr");
      const timeCell = document.createElement("td");

      const displayHour = hour.toString().padStart(2, "0");
      const displayMin = half === 0 ? "00" : "30";

      timeCell.textContent = `${displayHour}:${displayMin}`;
      row.appendChild(timeCell);

      for (let i = 0; i < days.length; i++) {
        const cell = document.createElement("td");
        cell.contentEditable = "true";
        cell.dataset.day = i;
        cell.dataset.time = `${displayHour}:${displayMin}`;
        row.appendChild(cell);
      }
      scheduleBody.appendChild(row);
    }
  }
}

function fillEmptyAndMergeVertical() {
  // 빈 셀 채우기
  for (let i = 0; i < scheduleBody.rows.length; i++) {
    const row = scheduleBody.rows[i];
    for (let j = 1; j <= days.length; j++) {
      const cell = row.cells[j];
      if (!cell.textContent.trim()) {
        // 빈 칸이면 랜덤 활동 넣기
        const randomHobby = hobbies[Math.floor(Math.random() * hobbies.length)];
        cell.textContent = randomHobby;
      }
    }
  }

  // 세로 병합 처리 (같은 단어 연속)
  for (let col = 1; col <= days.length; col++) {
    let prevText = "";
    let startRowIndex = 0;
    let rowspanCount = 1;

    for (let row = 0; row <= scheduleBody.rows.length; row++) {
      const currentText = row < scheduleBody.rows.length ? scheduleBody.rows[row].cells[col].textContent.trim() : null;

      if (row === 0) {
        prevText = currentText;
        startRowIndex = 0;
        rowspanCount = 1;
        continue;
      }

      if (currentText === prevText && currentText !== "") {
        rowspanCount++;
      } else {
        if (rowspanCount > 1) {
          const startCell = scheduleBody.rows[startRowIndex].cells[col];
          startCell.rowSpan = rowspanCount;

          // 다른 셀 숨기기
          for (let hideRow = startRowIndex + 1; hideRow < startRowIndex + rowspanCount; hideRow++) {
            scheduleBody.rows[hideRow].cells[col].style.display = "none";
          }

          // 배경색 지정
          const bgColor = getRandomColor(prevText);
          startCell.style.backgroundColor = bgColor;
          startCell.style.color = "white";
          startCell.style.fontWeight = "600";

          // 숨긴 셀 스타일 리셋
          for (let hideRow = startRowIndex + 1; hideRow < startRowIndex + rowspanCount; hideRow++) {
            const hiddenCell = scheduleBody.rows[hideRow].cells[col];
            hiddenCell.style.backgroundColor = "";
            hiddenCell.style.color = "";
            hiddenCell.style.fontWeight = "";
          }
        } else if (rowspanCount === 1 && prevText !== "") {
          // 1개짜리 셀 색 지정
          const singleCell = scheduleBody.rows[startRowIndex].cells[col];
          const bgColor = getRandomColor(prevText);
          singleCell.style.backgroundColor = bgColor;
          singleCell.style.color = "white";
          singleCell.style.fontWeight = "600";
          singleCell.rowSpan = 1;
          // display는 기본 (visible)
          singleCell.style.display = "";
        }

        prevText = currentText;
        startRowIndex = row;
        rowspanCount = 1;
      }
    }
  }
}

function resetSchedule() {
  scheduleBody.innerHTML = "";
  createScheduleTable();
  Swal.fire({
    icon: "info",
    title: "초기화 완료",
    text: "시간표가 초기 상태로 복원되었습니다.",
    background: "#1a202c",
    color: "#e2e8f0",
  });
}

function addCustomHobby() {
  const newHobby = customInput.value.trim();
  if (!newHobby) {
    Swal.fire({
      icon: "warning",
      title: "입력 오류",
      text: "추가할 활동 이름을 입력해주세요.",
      background: "#1a202c",
      color: "#e2e8f0",
    });
    return;
  }
  if (hobbies.includes(newHobby)) {
    Swal.fire({
      icon: "info",
      title: "중복됨",
      text: `"${newHobby}" 은(는) 이미 목록에 있습니다.`,
      background: "#1a202c",
      color: "#e2e8f0",
    });
    return;
  }
  hobbies.push(newHobby);
  customInput.value = "";
  Swal.fire({
    icon: "success",
    title: "추가 완료",
    text: `"${newHobby}" 활동이 추가되었습니다.`,
    background: "#1a202c",
    color: "#e2e8f0",
  });
}

window.onload = () => {
  createScheduleTable();

  generateBtn.addEventListener("click", () => {
    fillEmptyAndMergeVertical();
  });

  resetBtn.addEventListener("click", () => {
    resetSchedule();
  });

  addHobbyBtn.addEventListener("click", () => {
    addCustomHobby();
  });

  customInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addCustomHobby();
    }
  });
};
