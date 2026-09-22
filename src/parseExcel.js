import * as XLSX from 'xlsx'
import { GRADE_POINTS, PASS_GRADES, CATEGORIES } from './grades'

// 엑셀 헤더 이름이 학교마다 달라서, 키워드로 열을 찾음
const HEADER_KEYWORDS = {
  name: ['교과목명', '과목명', '과목', '강의명'],
  credit: ['학점'],
  grade: ['성적', '등급', '평가'],
  category: ['이수구분', '구분', '영역'],
}

function findColumn(headers, keywords) {
  return headers.findIndex((h) =>
    keywords.some((k) => String(h).replace(/\s/g, '').includes(k))
  )
}

// "A" → "A0" 처럼 성적 표기 통일
function normalizeGrade(raw) {
  const g = String(raw ?? '').trim().toUpperCase().replace('０', '0')
  if (['A', 'B', 'C', 'D'].includes(g)) return g + '0'
  if (g in GRADE_POINTS || PASS_GRADES.includes(g)) return g
  return ''
}

// "전필" → "전공필수" 처럼 줄임말 처리
function normalizeCategory(raw) {
  const c = String(raw ?? '').replace(/\s/g, '')
  const map = { 전필: '전공필수', 전선: '전공선택', 교필: '교양필수', 교선: '교양선택', 일선: '일반선택' }
  if (map[c]) return map[c]
  return CATEGORIES.find((cat) => c.includes(cat)) || '일반선택'
}

export async function parseGradeFile(file) {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer)             // xlsx, xls, csv 모두 읽힘
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) // 2차원 배열

  // 위쪽에 제목행이 있을 수 있어서, '학점'이 들어있는 행을 헤더로 찾음
  const headerIdx = rows.findIndex((r) => findColumn(r, HEADER_KEYWORDS.credit) !== -1)
  if (headerIdx === -1) throw new Error("'학점' 열을 찾을 수 없어요.")

  const headers = rows[headerIdx]
  const col = {
    name: findColumn(headers, HEADER_KEYWORDS.name),
    credit: findColumn(headers, HEADER_KEYWORDS.credit),
    grade: findColumn(headers, HEADER_KEYWORDS.grade),
    category: findColumn(headers, HEADER_KEYWORDS.category),
  }

  return rows
    .slice(headerIdx + 1)
    .filter((r) => r[col.credit] !== undefined && r[col.credit] !== '')
    .map((r) => ({
      id: crypto.randomUUID(),
      name: col.name >= 0 ? String(r[col.name] ?? '') : '',
      credit: Number(r[col.credit]) || 0,
      grade: col.grade >= 0 ? normalizeGrade(r[col.grade]) : '',
      category: col.category >= 0 ? normalizeCategory(r[col.category]) : '일반선택',
    }))
}