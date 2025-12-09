#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Portfolio Website PDF 생성 스크립트
index.html의 내용을 기반으로 모던한 PDF 문서를 생성합니다.

사용 방법:
1. reportlab 설치: pip install reportlab
2. 스크립트 실행: python doc/generate_portfolio_pdf.py
   또는 doc 폴더에서: python generate_portfolio_pdf.py
3. 생성된 파일: doc/PORTFOLIO_PRESENTATION.pdf
"""

import os
import sys
from pathlib import Path
from datetime import datetime

# 현재 스크립트의 디렉토리를 기준으로 경로 설정
SCRIPT_DIR = Path(__file__).parent.absolute()
DOC_DIR = SCRIPT_DIR
ROOT_DIR = SCRIPT_DIR.parent

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

def register_korean_fonts():
    """한글 폰트 등록"""
    try:
        # Windows 기본 한글 폰트 경로들
        font_paths = [
            'C:/Windows/Fonts/malgun.ttf',  # 맑은 고딕
            'C:/Windows/Fonts/gulim.ttc',   # 굴림
            'C:/Windows/Fonts/batang.ttc',  # 바탕
        ]
        
        korean_font_name = None
        
        # 사용 가능한 폰트 찾기
        for font_path in font_paths:
            if os.path.exists(font_path):
                try:
                    if font_path.endswith('.ttc'):
                        # TTC 파일의 경우 인덱스 지정 필요 (보통 0)
                        pdfmetrics.registerFont(TTFont('KoreanFont', font_path, subfontIndex=0))
                    else:
                        pdfmetrics.registerFont(TTFont('KoreanFont', font_path))
                    korean_font_name = 'KoreanFont'
                    print(f"✅ 한글 폰트 등록 성공: {font_path}")
                    break
                except Exception as e:
                    print(f"⚠️ 폰트 등록 실패 ({font_path}): {e}")
                    continue
        
        if not korean_font_name:
            print("⚠️ 한글 폰트를 찾을 수 없습니다. 기본 폰트를 사용합니다.")
            print("💡 한글이 깨질 수 있습니다. Windows 폰트 경로를 확인해주세요.")
            return 'Helvetica'  # 기본 폰트
        
        return korean_font_name
    except Exception as e:
        print(f"⚠️ 폰트 등록 중 오류: {e}")
        return 'Helvetica'

def create_portfolio_pdf():
    """포트폴리오 PDF 생성"""
    # 한글 폰트 등록
    korean_font = register_korean_fonts()
    
    # PDF 파일 생성 (기존 파일이 열려있으면 타임스탬프 추가)
    base_filename = DOC_DIR / "PORTFOLIO_PRESENTATION.pdf"
    filename = base_filename
    
    # 기존 파일이 있고 열려있으면 타임스탬프 추가
    if filename.exists():
        try:
            # 파일이 쓰기 가능한지 테스트
            test_file = open(filename, 'r+b')
            test_file.close()
        except (PermissionError, IOError):
            # 파일이 열려있으면 새 이름으로 저장
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = DOC_DIR / f"PORTFOLIO_PRESENTATION_{timestamp}.pdf"
            print(f"⚠️  기존 PDF 파일이 열려있어 새 파일명으로 저장합니다: {filename.name}")
    
    doc = SimpleDocTemplate(str(filename), pagesize=A4,
                            rightMargin=72, leftMargin=72,
                            topMargin=72, bottomMargin=18)
    
    # 스타일 정의
    styles = getSampleStyleSheet()
    
    # 모던한 색상 팔레트 (Color 객체와 hex 문자열 모두 저장)
    primary_color = colors.HexColor('#003366')  # 진한 파란색
    primary_color_hex = '#003366'
    secondary_color = colors.HexColor('#4682B4')  # 스틸 블루
    secondary_color_hex = '#4682B4'
    accent_color = colors.HexColor('#FF8C00')  # 다크 오렌지
    accent_color_hex = '#FF8C00'
    text_color = colors.HexColor('#333333')  # 다크 그레이
    text_color_hex = '#333333'
    
    # 커스텀 스타일 생성 (한글 폰트 사용)
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=28,
        textColor=primary_color,
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName=korean_font if korean_font != 'Helvetica' else 'Helvetica-Bold'
    )
    
    heading1_style = ParagraphStyle(
        'CustomHeading1',
        parent=styles['Heading1'],
        fontSize=20,
        textColor=primary_color,
        spaceAfter=12,
        spaceBefore=20,
        fontName=korean_font if korean_font != 'Helvetica' else 'Helvetica-Bold'
    )
    
    heading2_style = ParagraphStyle(
        'CustomHeading2',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=secondary_color,
        spaceAfter=10,
        spaceBefore=15,
        fontName=korean_font if korean_font != 'Helvetica' else 'Helvetica-Bold'
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=11,
        textColor=text_color,
        spaceAfter=12,
        alignment=TA_JUSTIFY,
        fontName=korean_font
    )
    
    bullet_style = ParagraphStyle(
        'CustomBullet',
        parent=styles['Normal'],
        fontSize=11,
        textColor=text_color,
        spaceAfter=6,
        leftIndent=20,
        bulletIndent=10,
        fontName=korean_font
    )
    
    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Normal'],
        fontSize=14,
        textColor=secondary_color,
        spaceAfter=20,
        alignment=TA_CENTER,
        fontName=korean_font
    )
    
    # 스토리 (문서 내용) 리스트
    story = []
    
    # 1. 타이틀 페이지
    story.append(Spacer(1, 2*inch))
    story.append(Paragraph("Portfolio", title_style))
    story.append(Spacer(1, 0.3*inch))
    story.append(Paragraph("Full-Stack Developer", subtitle_style))
    story.append(Paragraph("Java • Spring Framework • Flutter • Mobile Development", subtitle_style))
    story.append(PageBreak())
    
    # 2. About Me 섹션
    story.append(Paragraph("About Me", heading1_style))
    story.append(Paragraph("<b>Full-Stack 개발자</b>", normal_style))
    story.append(Spacer(1, 0.2*inch))
    
    story.append(Paragraph("<b>전문 분야:</b>", normal_style))
    story.append(Paragraph("• Java, Spring Framework, Flutter 등 다양한 기술 스택을 활용한 웹 및 모바일 애플리케이션 개발", bullet_style))
    story.append(Paragraph("• 우리은행, 신한은행, KB국민카드 등 금융권 프로젝트 경험", bullet_style))
    story.append(Paragraph("• 안드로이드 네이티브 앱 개발부터 백엔드 서버 개발까지 전반적인 개발 역량", bullet_style))
    
    story.append(Spacer(1, 0.1*inch))
    story.append(Paragraph("<b>주요 통계:</b>", normal_style))
    story.append(Paragraph("✓ 15+ 프로젝트 완료", bullet_style))
    story.append(Paragraph("✓ 6+ 년 프리랜서 경력", bullet_style))
    story.append(Paragraph("✓ 4개 자격증 보유", bullet_style))
    
    story.append(Spacer(1, 0.1*inch))
    story.append(Paragraph("지속적인 학습과 성장을 통해 더 나은 개발자가 되기 위해 노력하고 있으며, 최근에는 Spring Framework 기반 Java Full-Stack 개발자 양성과정을 수료하여 최신 기술을 습득했습니다.", normal_style))
    story.append(PageBreak())
    
    # 3. Technical Skills 섹션
    story.append(Paragraph("Technical Skills", heading1_style))
    
    # Backend
    story.append(Paragraph("Backend", heading2_style))
    backend_skills = [
        ('Java', '90%', '객체지향 프로그래밍, 멀티스레딩'),
        ('Spring Framework', '90%', 'MVC, Security, Data JPA'),
        ('Spring Boot', '85%', '마이크로서비스 아키텍처'),
        ('Spring AI', '80%', 'AI 통합 및 LLM 연동'),
        ('JSP/Servlet', '85%', '웹 애플리케이션 개발'),
        ('MyBatis', '85%', '데이터베이스 매핑'),
        ('Python', '80%', '스크립팅 및 자동화')
    ]
    
    for skill, level, desc in backend_skills:
        story.append(Paragraph(f"• <b>{skill}</b> ({level}) - {desc}", bullet_style))
    
    story.append(Spacer(1, 0.1*inch))
    story.append(Paragraph("<b>주요 경험:</b>", normal_style))
    story.append(Paragraph("✓ RESTful API 설계 및 구현", bullet_style))
    story.append(Paragraph("✓ Spring Security 기반 인증/인가 시스템", bullet_style))
    story.append(Paragraph("✓ OAuth2 소셜 로그인 통합", bullet_style))
    story.append(Paragraph("✓ Spring AI를 활용한 AI 기능 구현", bullet_style))
    
    # Frontend & Mobile
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph("Frontend & Mobile", heading2_style))
    frontend_skills = [
        ('HTML5/CSS3', '90%', '반응형 웹 디자인'),
        ('Bootstrap', '85%', 'UI 프레임워크'),
        ('JavaScript/jQuery', '85%', '동적 웹 개발'),
        ('Flutter/Dart', '85%', '크로스 플랫폼 개발'),
        ('Android/Java & Kotlin', '90%', '네이티브 앱 개발'),
        ('iOS/Swift & SwiftUI', '80%', 'iOS 앱 개발'),
        ('Python', '80%', '모바일 자동화')
    ]
    
    for skill, level, desc in frontend_skills:
        story.append(Paragraph(f"• <b>{skill}</b> ({level}) - {desc}", bullet_style))
    
    story.append(Spacer(1, 0.1*inch))
    story.append(Paragraph("<b>주요 경험:</b>", normal_style))
    story.append(Paragraph("✓ Flutter 기반 크로스 플랫폼 앱 개발", bullet_style))
    story.append(Paragraph("✓ Android 네이티브 앱 개발 (금융권 프로젝트)", bullet_style))
    story.append(Paragraph("✓ iOS 앱 개발 및 배포", bullet_style))
    story.append(Paragraph("✓ 반응형 웹 애플리케이션 개발", bullet_style))
    
    # Database & Tools
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph("Database & Tools", heading2_style))
    db_tools = [
        ('Oracle', '85%', '엔터프라이즈 데이터베이스'),
        ('Git/GitHub & GitLab & Bitbucket', '85%', '버전 관리'),
        ('CI/CD (Jenkins)', '75%', '지속적 통합/배포'),
        ('Docker', '80%', '컨테이너화'),
        ('Figma', '80%', 'UI/UX 디자인')
    ]
    
    for tool, level, desc in db_tools:
        story.append(Paragraph(f"• <b>{tool}</b> ({level}) - {desc}", bullet_style))
    
    story.append(Spacer(1, 0.1*inch))
    story.append(Paragraph("<b>주요 경험:</b>", normal_style))
    story.append(Paragraph("✓ Oracle 23 AI 데이터베이스 설계 및 최적화", bullet_style))
    story.append(Paragraph("✓ Git 기반 협업 및 코드 리뷰", bullet_style))
    story.append(Paragraph("✓ Docker를 활용한 컨테이너화 및 배포", bullet_style))
    story.append(Paragraph("✓ CI/CD 파이프라인 구축 및 관리", bullet_style))
    story.append(PageBreak())
    
    # 4. Key Experience 섹션
    story.append(Paragraph("Key Experience", heading1_style))
    
    experiences = [
        {
            'company': '우리은행',
            'project': 'WON뱅킹 Re-Modeling',
            'period': '2022.07 - 2023.07 (12개월)',
            'description': [
                '우리은행 개인비대면 채널 Re-Modeling 추진사업',
                '만보기 기능 추가',
                '이체기능 네이티브 → 웹 서비스 전환',
                '로컬 CI/CD 환경 구축'
            ],
            'tech': 'Android, Java, Kotlin, WebView, CI/CD'
        },
        {
            'company': '신한은행',
            'project': '땡겨요 O2O 플랫폼',
            'period': '2021.10 - 2022.02 (5개월)',
            'description': [
                '음식주문중개 O2O 플랫폼 구축',
                'Pull refresh 확장기능 개발',
                '땡기기 기능 구현',
                'WebView 설계 및 구현',
                'Docker를 이용한 암호화/빌드 시스템 관리'
            ],
            'tech': 'Android, Java, Docker, WebView'
        },
        {
            'company': 'KB 국민카드',
            'project': 'MyData 플랫폼',
            'period': '2021.04 - 2021.08 (5개월)',
            'description': [
                'KB 국민카드 표준API기반 MyData 플랫폼 개편 프로젝트',
                '표준API기반 MyData 기능 적용',
                '전체메뉴 > 메뉴검색 기능 추가'
            ],
            'tech': 'Android, Java, RESTful API'
        },
        {
            'company': '하나은행',
            'project': 'Line Bank Indonesia',
            'period': '2020.08 - 2021.03 (8개월)',
            'description': [
                '인도네시아 하나은행 Linebank 앱 개발',
                'MVVM 패턴 설계 및 구현',
                '보안 키패드 이슈 해결',
                'Django & Bootstrap을 활용한 내부용 앱 배포 사이트 구축'
            ],
            'tech': 'Android, Java, MVVM, Django, Bootstrap'
        },
        {
            'company': 'KB국민은행',
            'project': '마이머니 App 고도화',
            'period': '2019.08 - 2019.11 (4개월)',
            'description': [
                'KB국민은행 마이머니 Android App 고도화 작업',
                '안드로이드 네이티브 앱 개발',
                '인트로 화면/프로그레스바 고도화',
                '지문인증 솔루션 업데이트',
                'androidX 컨버팅'
            ],
            'tech': 'Android, Java, AndroidX'
        },
        {
            'company': '키움증권',
            'project': '영웅문S MTS 개발',
            'period': '2018.05 - 2018.12 (8개월)',
            'description': [
                '키움증권 영웅문S MTS 고도화 프로젝트',
                '관심종목 C++ 공통 플랫폼 개발',
                'Javascript를 이용한 MTS 화면개발'
            ],
            'tech': 'C++, JavaScript, WebView'
        }
    ]
    
    for exp in experiences:
        story.append(Paragraph(f"<b>{exp['company']} - {exp['project']}</b>", heading2_style))
        period_p = Paragraph(f"<font color='{secondary_color_hex}'><b>{exp['period']}</b></font>", normal_style)
        story.append(period_p)
        story.append(Paragraph("<b>프로젝트 내용:</b>", normal_style))
        for desc in exp['description']:
            story.append(Paragraph(f"• {desc}", bullet_style))
        tech_p = Paragraph(f"<i><font color='{accent_color_hex}'>기술 스택: {exp['tech']}</font></i>", normal_style)
        story.append(tech_p)
        story.append(Spacer(1, 0.2*inch))
    
    story.append(PageBreak())
    
    # 5. Featured Projects 섹션
    story.append(Paragraph("Featured Projects", heading1_style))
    
    # Miracle Reading System
    story.append(Paragraph("Miracle Reading System", heading2_style))
    story.append(Paragraph("프로젝트 개요: 독서 습관 형성과 도서 관리를 위한 종합적인 웹 애플리케이션", normal_style))
    story.append(Paragraph("<b>개발 기간:</b> 2025.11.10 - 2025.12.10 (1개월)", normal_style))
    story.append(Paragraph("개발 형태: 개인 프로젝트 (1인 총괄 개발)", normal_style))
    
    story.append(Paragraph("<b>주요 기능:</b>", normal_style))
    mrs_features = [
        '사용자 인증 및 관리 (폼 로그인, OAuth2)',
        '도서 관리 시스템 (알라딘 API 연동)',
        'AI 기반 도서 요약 (Spring AI + Ollama)',
        '독서 계획 및 기록 관리',
        '속독 훈련 기능',
        '갤러리 및 소셜 기능 (좋아요, 댓글)',
        '마인드맵 기능',
        '관리자 콘솔'
    ]
    for feature in mrs_features:
        story.append(Paragraph(f"✓ {feature}", bullet_style))
    
    tech_p = Paragraph(f"<i><font color='{accent_color_hex}'>기술 스택: Java 17, Spring Boot 3.3.5, Spring AI, Oracle 23 AI, JSP, Bootstrap 5, jQuery, Docker, Ollama (Qwen3:1.7b)</font></i>", normal_style)
    story.append(tech_p)
    
    story.append(Paragraph("<b>주요 성과:</b>", normal_style))
    story.append(Paragraph("• AI 통합: Spring AI를 활용한 로컬 LLM 연동", bullet_style))
    story.append(Paragraph("• 확장 가능한 아키텍처: 계층형 구조 설계", bullet_style))
    story.append(Paragraph("• 다중 인증 시스템: 폼 로그인 + OAuth2 통합", bullet_style))
    
    story.append(Spacer(1, 0.2*inch))
    
    # Productivity Hub
    story.append(Paragraph("Productivity Hub", heading2_style))
    story.append(Paragraph("프로젝트 개요: Flutter 기반의 통합 생산성 앱", normal_style))
    story.append(Paragraph("<b>개발 기간:</b> 2025.12.04 오후 (4시간)", normal_style))
    story.append(Paragraph("개발 형태: 개인 프로젝트 (1인 총괄 개발)", normal_style))
    
    story.append(Paragraph("<b>주요 기능:</b>", normal_style))
    ph_features = [
        '할 일 관리 (Todo) - 추가/수정/삭제, 완료 상태 토글',
        '아이디어 기록 - 카테고리별 아이디어 관리',
        '독서 카드 - 독서 진행 관리, 키워드/요약 기록',
        '날씨 정보 - 현재 위치 및 도시별 날씨 조회',
        '뉴스 피드 - AI/양자컴퓨팅 관련 최신 뉴스'
    ]
    for feature in ph_features:
        story.append(Paragraph(f"✓ {feature}", bullet_style))
    
    tech_p = Paragraph(f"<i><font color='{accent_color_hex}'>기술 스택: Flutter 3.x, Dart, Provider, SQLite, Open-Meteo API, RSS Feed, Geolocator</font></i>", normal_style)
    story.append(tech_p)
    
    story.append(Paragraph("<b>아키텍처:</b>", normal_style))
    story.append(Paragraph("• Provider 패턴 (MVVM 기반) 상태 관리", bullet_style))
    story.append(Paragraph("• SQLite 로컬 데이터 저장", bullet_style))
    story.append(Paragraph("• RESTful API 연동 (날씨, 뉴스)", bullet_style))
    story.append(Paragraph("• 반응형 UI 디자인", bullet_style))
    
    story.append(PageBreak())
    
    # 6. Education & Certifications 섹션
    story.append(Paragraph("Education & Certifications", heading1_style))
    
    # 학사/석사 학위
    story.append(Paragraph("학위", heading2_style))
    story.append(Paragraph("• <b>석사</b> - 광주과학기술원 기전공학과 (2005.03 ~ 2007.08)", bullet_style))
    story.append(Paragraph("• <b>학사</b> - 강원대학교 전기전자공학과 (1995.03 ~ 2004.02)", bullet_style))
    
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph("교육 이력", heading2_style))
    educations = [
        ('Spring Framework 기반 Java Full-Stack 개발자 양성과정', '쌍용강북교육센터', '2025.05.12 - 2025.11.12', '944시간'),
        ('소음진동평가모니터링시스템개발 과정', '경영기술개발원교육센터', '2012.06 - 2012.12', '960시간'),
        ('임베디드 SW 전문가 과정', '한국정보기술연구원', '2007.10 - 2008.03', '960시간')
    ]
    
    for edu, org, period, hours in educations:
        story.append(Paragraph(f"• <b>{edu}</b>", bullet_style))
        story.append(Paragraph(f"  {org} ({period}, {hours})", bullet_style))
    
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph("자격증", heading2_style))
    certifications = [
        ('정보처리기사', '2025.09'),
        ('RFID-GL', '2013.11'),
        ('SCJP', '2010.04'),
        ('전기공사', '2004.08')
    ]
    
    for cert, date in certifications:
        story.append(Paragraph(f"✓ {cert} ({date})", bullet_style))
    
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph("해외 경험", heading2_style))
    story.append(Paragraph("<b>산업인력공단 월드잡 연수 프로그램</b> (2010.07 ~ 2011.05)", bullet_style))
    story.append(Paragraph("• Canadagate IT 비즈니스 실무 과정 참여", bullet_style))
    story.append(Paragraph("• 레벨테스트 후 Advanced 과정(Toefl) 수업 약 4개월 수강", bullet_style))
    story.append(Paragraph("• 현지영어기술습득과 잠재능력 활용을 위한 자기계발", bullet_style))
    story.append(Paragraph("• 미국, 캐나다 Brain-based Speed Reading 세미나 참석", bullet_style))
    
    story.append(PageBreak())
    
    # 7. Core Competencies 섹션
    story.append(Paragraph("Core Competencies", heading1_style))
    
    story.append(Paragraph("기술 역량", heading2_style))
    story.append(Paragraph("<b>Full-Stack Development:</b>", normal_style))
    story.append(Paragraph("• Backend: Java, Spring Framework, Spring Boot, Spring AI", bullet_style))
    story.append(Paragraph("• Frontend: HTML5/CSS3, JavaScript, jQuery, Bootstrap", bullet_style))
    story.append(Paragraph("• Mobile: Android (Java/Kotlin), iOS (Swift/SwiftUI), Flutter", bullet_style))
    story.append(Paragraph("• Database: Oracle, SQLite", bullet_style))
    story.append(Paragraph("• DevOps: Git, Docker, CI/CD (Jenkins)", bullet_style))
    
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph("프로젝트 경험", heading2_style))
    story.append(Paragraph("<b>금융권 프로젝트:</b>", normal_style))
    story.append(Paragraph("• 우리은행, 신한은행, KB국민카드/은행, 하나은행 등", bullet_style))
    story.append(Paragraph("• 안드로이드 네이티브 앱 개발", bullet_style))
    story.append(Paragraph("• 웹 서비스 전환 및 고도화", bullet_style))
    story.append(Paragraph("• 보안 및 인증 시스템 구현", bullet_style))
    
    story.append(Paragraph("<b>기타 프로젝트:</b>", normal_style))
    story.append(Paragraph("• O2O 플랫폼 개발", bullet_style))
    story.append(Paragraph("• 증권사 MTS 개발", bullet_style))
    story.append(Paragraph("• 도시가스 검침 시스템 개발", bullet_style))
    story.append(Paragraph("• 통합 생산성 앱 개발", bullet_style))
    
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph("주요 강점", heading2_style))
    strengths = [
        '금융권 프로젝트 다수 경험',
        '풀스택 개발 역량',
        '크로스 플랫폼 개발 경험',
        '최신 기술 학습 및 적용 능력'
    ]
    for strength in strengths:
        story.append(Paragraph(f"✓ {strength}", bullet_style))
    
    # 8. Contact 섹션
    story.append(PageBreak())
    story.append(Spacer(1, 2*inch))
    story.append(Paragraph("Contact", heading1_style))
    story.append(Spacer(1, 0.3*inch))
    story.append(Paragraph("문의사항이 있으시면 언제든지 연락주세요.", normal_style))
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph("LinkedIn: linkedin.com/in/namil-kim-a59951123", normal_style))
    story.append(Paragraph("GitHub: github.com/NAM-IL", normal_style))
    
    # PDF 생성
    try:
        doc.build(story)
        print(f"✅ 포트폴리오 PDF가 생성되었습니다: {filename}")
        print(f"📄 총 {len(story)}개의 요소가 포함되어 있습니다.")
        print(f"\n💡 index.html의 내용을 기반으로 작성되었습니다.")
        print(f"📁 저장 위치: {filename}")
    except PermissionError as e:
        print(f"❌ 권한 오류: PDF 파일을 생성할 수 없습니다.")
        print(f"   파일이 다른 프로그램에서 열려있거나 권한이 없습니다.")
        print(f"   파일 경로: {filename}")
        print(f"   💡 해결 방법:")
        print(f"      1. PDF 뷰어나 다른 프로그램에서 파일을 닫아주세요.")
        print(f"      2. 파일이 읽기 전용인지 확인해주세요.")
        print(f"      3. 관리자 권한으로 실행해보세요.")
        print(f"   상세 오류: {e}")
        raise

if __name__ == "__main__":
    try:
        create_portfolio_pdf()
    except ImportError:
        print("❌ reportlab 라이브러리가 설치되지 않았습니다.")
        print("📦 설치 방법: pip install reportlab")
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        import traceback
        traceback.print_exc()
