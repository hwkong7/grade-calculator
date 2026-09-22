// 4.5 만점 기준 성적 → 평점
export const GRADE_POINTS = {
  'A+': 4.5, 'A0': 4.0, 'A': 4.0,
  'B+': 3.5, 'B0': 3.0, 'B': 3.0,
  'C+': 2.5, 'C0': 2.0, 'C': 2.0,
  'D+': 1.5, 'D0': 1.0, 'D': 1.0,
  'F': 0,
}

// P/NP 같은 과목은 이수학점에는 들어가지만 평점 계산에서는 빠짐
export const PASS_GRADES = ['P', 'NP', 'S', 'U']

export const CATEGORIES = ['전공필수', '전공선택', '교양필수', '교양선택', '일반선택']

// 평점평균 계산
export function calcGPA(courses) {
  let totalPoints = 0
  let gpaCredits = 0   // 평점 계산에 들어가는 학점
  let earnedCredits = 0 // 실제 이수한 학점 (F, NP 제외)

  for (const c of courses) {
    const credit = Number(c.credit) || 0
    const grade = c.grade

    if (grade in GRADE_POINTS) {
      totalPoints += GRADE_POINTS[grade] * credit
      gpaCredits += credit
      if (grade !== 'F') earnedCredits += credit
    } else if (grade === 'P' || grade === 'S') {
      earnedCredits += credit
    }
  }

  return {
    gpa: gpaCredits ? totalPoints / gpaCredits : 0,
    gpaCredits,
    earnedCredits,
  }
}x``