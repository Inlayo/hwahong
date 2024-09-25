// 필수 정보
const apiKey = '34ff04d810454575a10ccfad4024f3b7';
const eduOfficeCode = 'J10'; // 교육청 코드
const schoolCode = '7530479'; // 학교 코드

// 현재 날짜 표시
document.getElementById('current-date').innerText = `오늘 날짜: ${new Date().toISOString().slice(0, 10)}`;

// API 호출 함수
async function fetchAPI(url) {
  const response = await fetch(url);
  return response.ok ? response.json() : null;
}

// 오늘의 시간표와 급식 정보 가져오기
async function fetchTodayData() {
  const grade = document.getElementById('grade').value;
  const classNum = document.getElementById('class_num').value;
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // 오늘 날짜

  const [timetableData, mealData] = await Promise.all([
    fetchAPI(`https://open.neis.go.kr/hub/hisTimetable?KEY=${apiKey}&ATPT_OFCDC_SC_CODE=${eduOfficeCode}&SD_SCHUL_CODE=${schoolCode}&GRADE=${grade}&CLASS_NM=${classNum}&TI_FROM_YMD=${today}&TI_TO_YMD=${today}&Type=json`),
    fetchAPI(`https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${apiKey}&ATPT_OFCDC_SC_CODE=${eduOfficeCode}&SD_SCHUL_CODE=${schoolCode}&MLSV_YMD=${today}&Type=json`)
  ]);

  displayData(timetableData, mealData);
}

// 데이터를 화면에 출력
function displayData(timetableData, mealData) {
  const scheduleDiv = document.getElementById('schedule');
  const mealDiv = document.getElementById('meal');
  
  // 시간표 출력
  scheduleDiv.innerHTML = timetableData?.hisTimetable 
    ? timetableData.hisTimetable[1].row.map(period => `<p>${period.PERIO}교시: ${period.ITRT_CNTNT}</p>`).join('')
    : '오늘은 시간표가 없습니다.';

  // 급식 출력
  mealDiv.innerHTML = mealData?.mealServiceDietInfo 
    ? mealData.mealServiceDietInfo[1].row.map(meal => `<p>${meal.MMEAL_SC_NM}: ${meal.DDISH_NM.replace(/<br\/>/g, ', ')}</p>`).join('')
    : '오늘은 급식이 없습니다.';
}

// 버튼에 이벤트 리스너 추가
document.getElementById('today-btn').addEventListener('click', fetchTodayData);
