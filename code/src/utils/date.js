const nowDate = () => {
    // Node 서버의 Timezone이 UTC이므로 한국 기준의 시간을 string으로 도출
    // 이상하게 Heroku에서는 "2021. 10. 9."로 나오고, locald에서는 "2021-10-9"으로 나와서 하나로 통일하기 위해해
    const date = new Date().toLocaleDateString('ko-KR').replace(/. /g, '-')

    // '-'를 구분자로 연도, 월, 일 구분.
    const dateList = date.split('-')

    const year = dateList[0].slice(-2)
    const month = dateList[1] < 10 ? '0' + dateList[1] : dateList[1]
    const day = dateList[2] < 10 ? '0' + dateList[2].replace('.', '') : dateList[2].replace('.', '')

    return  year + month + day
}

module.exports = { nowDate }