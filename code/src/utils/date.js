const nowDate = () => {
    // Node 서버의 Timezone이 UTC이므로 한국 기준의 시간을 string으로 도출
    const date = new Date().toLocaleDateString('ko-KR')
    // '-'를 구분자로 연도, 월, 일 구분.
    const dateList = date.split('-')

    const year = dateList[0].slice(-2)
    const month = dateList[1] < 10 ? '0' + dateList[1] : dateList[1]
    const day = dateList[2] < 10 ? '0' + dateList[2] : dateList[2]
    console.log( year, month, day)

    return  year + month + day
}

module.exports = { nowDate }