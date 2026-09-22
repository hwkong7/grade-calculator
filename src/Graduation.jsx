import { useState } from 'react'
import { CATEGORIES } from './grades'

// 기본값은 예시! 학교 학사편람 보고 직접 바꾸세요.
const DEFAULT_REQ = {
  total: 130,
  minGPA: 2.0,
  전공필수: 30,
  전공선택: 36,
  교양필수: 15,
  교양선택: 15,
  일반선택: 0,
}

// F, NP, 성적 미입력 과목은 이수로 안 침
const isPassed = (grade) => grade && grade !== 'F' && grade !== 'NP' && grade !== 'U'

export default function Graduation({ courses, gpa }) {
  const [req, setReq] = useState(DEFAULT_REQ)

  const passed = courses.filter((c) => isPassed(c.grade))
  const total = passed.reduce((sum, c) => sum + Number(c.credit), 0)

  const byCategory = {}
  for (const cat of CATEGORIES) {
    byCategory[cat] = passed
      .filter((c) => c.category === cat)
      .reduce((sum, c) => sum + Number(c.credit), 0)
  }

  const rows = [
    { key: 'total', label: '총 이수학점', have: total },
    ...CATEGORIES.map((cat) => ({ key: cat, label: cat, have: byCategory[cat] })),
  ]

  const gpaOk = gpa >= req.minGPA
  const allOk = gpaOk && rows.every((r) => r.have >= req[r.key])

  return (
    <section className="graduation">
      <h2>📋 졸업요건 계산기</h2>
      <p className="hint">요건 숫자를 클릭해서 우리 학교 기준으로 수정하세요.</p>

      {rows.map((r) => {
        const need = req[r.key]
        const percent = need ? Math.min((r.have / need) * 100, 100) : 100
        const left = Math.max(need - r.have, 0)
        return (
          <div key={r.key} className="req-row">
            <div className="req-label">
              <span>{r.label}</span>
              <span>
                {r.have} /{' '}
                <input type="number" className="small" value={need}
                  onChange={(e) => setReq({ ...req, [r.key]: Number(e.target.value) })} />
                {left > 0 ? <em className="need"> ({left}학점 부족)</em> : <em className="ok"> ✔</em>}
              </span>
            </div>
            <div className="bar"><div style={{ width: `${percent}%` }} /></div>
          </div>
        )
      })}

      <div className="req-row">
        <div className="req-label">
          <span>최소 평점</span>
          <span>
            {gpa.toFixed(2)} /{' '}
            <input type="number" step="0.1" className="small" value={req.minGPA}
              onChange={(e) => setReq({ ...req, minGPA: Number(e.target.value) })} />
            {gpaOk ? <em className="ok"> ✔</em> : <em className="need"> (미달)</em>}
          </span>
        </div>
      </div>

      <p className={`verdict ${allOk ? 'ok' : 'need'}`}>
        {allOk ? '🎉 졸업요건을 모두 충족했어요!' : '아직 채워야 할 요건이 있어요.'}
      </p>
    </section>
  )
}