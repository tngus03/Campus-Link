"use client";

import { useState } from "react";

/** 학교 목록과 대응 도메인 */
const SCHOOLS = [
  { id: "snu", name: "서울대학교", domain: "snu.ac.kr", enum: "SNU" },
  { id: "yonsei", name: "연세대학교", domain: "yonsei.ac.kr", enum: "YONSEI" },
  { id: "korea", name: "고려대학교", domain: "korea.ac.kr", enum: "KOREA" },
  { id: "sogang", name: "서강대학교", domain: "sogang.ac.kr", enum: "SOGANG" },
  { id: "skku", name: "성균관대학교", domain: "skku.edu", enum: "SKKU" },
  { id: "hanyang", name: "한양대학교", domain: "hanyang.ac.kr", enum: "HANYANG" },
  { id: "cau", name: "중앙대학교", domain: "cau.ac.kr", enum: "CAU" },
  { id: "khu", name: "경희대학교", domain: "khu.ac.kr", enum: "KHU" },
  { id: "hufs", name: "한국외국어대학교", domain: "hufs.ac.kr", enum: "HUFS" },
  { id: "uos", name: "서울시립대학교", domain: "uos.ac.kr", enum: "UOS" },
  { id: "konkuk", name: "건국대학교", domain: "konkuk.ac.kr", enum: "KONKUK" },
  { id: "dgu", name: "동국대학교", domain: "dgu.ac.kr", enum: "DGU" },
  { id: "hongik", name: "홍익대학교", domain: "hongik.ac.kr", enum: "HONGIK" },
  { id: "cnu", name: "충남대학교", domain: "o.cnu.ac.kr", enum: "CNU" },
  { id: "chungbuk", name: "충북대학교", domain: "chungbuk.ac.kr", enum: "CHUNGBUK" },
  { id: "dku_cheonan", name: "단국대학교(천안)", domain: "dankook.ac.kr", enum: "DKU_CHEONAN" },
  { id: "sch", name: "순천향대학교", domain: "sch.ac.kr", enum: "SCH" },
  { id: "hoseo", name: "호서대학교", domain: "hoseo.vision.edu", enum: "HOSEO" },
  { id: "baekseok", name: "백석대학교", domain: "bu.ac.kr", enum: "BAEKSEOK" },
  { id: "sunmoon", name: "선문대학교", domain: "sunmoon.com", enum: "SUNMOON" },
];

export default function SchoolEmailField() {
  const [school, setSchool] = useState(SCHOOLS[0]); // 기본값 첫 학교
  const [local, setLocal] = useState("");

  const email = local ? `${local}@${school.domain}` : "";

  return (
    <div className="flex flex-col gap-4">
      {/* ① 학교 선택 */}
      <label className="flex flex-col gap-1 text-sm font-medium text-white">
        학교 선택
        <select
          required
          value={school.id}
          onChange={(e) => {
            const found = SCHOOLS.find((s) => s.id === e.target.value);
            if (found) setSchool(found);
          }}
          className="rounded-md bg-neutral-800 px-3 py-2"
        >
          {SCHOOLS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>

      {/* ② 이메일 입력 */}
      <label className="flex flex-col gap-1 text-sm font-medium text-white">
        학교 이메일
        <div className="flex">
          <input
            type="text"
            required
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            placeholder="아이디만 입력"
            className="flex-1 rounded-l-md bg-neutral-800 px-3 py-2 focus:outline-none"
          />
          <span className="rounded-r-md bg-neutral-700 px-3 py-2 text-sm select-none">
            @{school.domain}
          </span>
        </div>
      </label>

      {/* 서버에 전송할 필드들 */}
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="school" value={school.enum} />
    </div>
  );
}
