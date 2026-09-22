import { useState } from 'react'
import { GRADE_POINTS, PASS_GRADES, CATEGORIES, calcGPA } from './grades'
import { parseGradeFile } from './parseExcel'
import Graduation from './Graduation'

const emptyCourse = () => ({
  id: crypto.randomUUID(), name: '', credit: 3, grade: 'A+', category: '전공선택',
})

export default function App() {
  const [courses, setCourses] = useState([emptyCourse()])
  const [error, setError] = useState('')

  const { gpa, gpaCredits, earnedCredits } = calcGPA(courses)

  const updateCourse = (id, field, value) => {
    setCourses(courses.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  const removeCourse = (id) => setCourses(courses.filter((c) => c.id !== id))

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const imported = await parseGradeFile(file)
      setCourses(imported)
      setError('')
    } catch (err) {
      setError(err.message)
    }
    e.target.value = '' // 같은 파일 다시 올릴 수 있게 초기화
  }

  return (
    <div className="container">
      <h1>🎓 학점 계산기</h1>

      <div className="upload">
        <label className="btn">
          📂 엑셀/CSV 불러오기
          <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} hidden />
        </label>
        <span className="hint">과목명 · 학점 · 성적 · 이수구분 열이 있으면 자동 인식돼요</span>
      </div>
      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>과목명</th><th>학점</th><th>성적</th><th>이수구분</th><th></th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.id}>
              <td>
                <input value={c.name} placeholder="과목명"
                  onChange={(e) => updateCourse(c.id, 'name', e.target.value)} />
              </td>
              <td>
                <input type="number" min="0" value={c.credit} className="small"
                  onChange={(e) => updateCourse(c.id, 'credit', e.target.value)} />
              </td>
              <td>
                <select value={c.grade} onChange={(e) => updateCourse(c.id, 'grade', e.target.value)}>
                  <option value="">-</option>
                  {[...Object.keys(GRADE_POINTS).filter((g) => g.length === 2 || g === 'F'), ...PASS_GRADES]
                    .map((g) => <option key={g}>{g}</option>)}
                </select>
              </td>
              <td>
                <select value={c.category} onChange={(e) => updateCourse(c.id, 'category', e.target.value)}>
                  {CATEGORIES.map((cat) => <option key={cat}>{cat}</option>)}
                </select>
              </td>
              <td><button className="del" onClick={() => removeCourse(c.id)}>✕</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="btn add" onClick={() => setCourses([...courses, emptyCourse()])}>
        + 과목 추가
      </button>

      <div className="result">
        <div><span>평점평균</span><strong>{gpa.toFixed(2)}</strong> / 4.5</div>
        <div><span>이수학점</span><strong>{earnedCredits}</strong></div>
        <div><span>평점 반영 학점</span><strong>{gpaCredits}</strong></div>
      </div>

      <Graduation courses={courses} gpa={gpa} />
    </div>
  )
}