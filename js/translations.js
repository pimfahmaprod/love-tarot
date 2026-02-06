/**
 * Valentine Tarot - Translations Data
 *
 * @description UI text translations for 6 languages
 * @version 1.1.0
 *
 * EXPORTS:
 * - translations: Object with UI strings for each language
 * - cardNameTranslations: Object (empty - card names kept in English)
 *
 * SUPPORTED LANGUAGES:
 * - th: Thai (default)
 * - en: English
 * - zh-CN: Simplified Chinese
 * - zh-TW: Traditional Chinese
 * - ko: Korean
 * - ja: Japanese
 * - fr: French
 *
 * TRANSLATION STRUCTURE:
 * translations[lang].section.key
 *
 * SECTIONS: landing, main, ranking, result, comment, comments,
 *           blessing, toast, common
 *
 * USAGE IN HTML:
 * <span data-i18n="result.drawAgain">จับใหม่</span>
 *
 * USAGE IN JS:
 * translations[currentLang].result.drawAgain
 */

// ========================================
// UI Translations
// ========================================
const translations = {
    th: {
        landing: {
            heading: "Who's Gonna Be My Next",
            mistake: "Mistake?",
            valentine: "Valentine!",
            loading: "กำลังโหลด...",
            instruction: "ใครจะเข้ามาในชีวิตคุณช่วงวาเลนไทน์?",
            clickToDraw: "แตะไพ่เพื่อเริ่มดูดวง"
        },
        main: {
            title: "ใครจะเข้ามาในชีวิตคุณช่วงวาเลนไทน์",
            instruction: "เลือกไพ่ 1 ใบ เพื่อดูคำทำนาย",
            loadingCards: "กำลังโหลดไพ่..."
        },
        ranking: {
            title: "ไพ่ยอดนิยม"
        },
        result: {
            saveImage: "เซฟรูป :",
            share: "บอกต่อ :",
            copy: "คัดลอก",
            acceptProphecy: "น้อมรับคำทำนาย",
            hideSection: "ซ่อน",
            view: "ส่อง",
            notSerious: "ยังไม่เอาจริง",
            drawAgain: "จับใหม่",
            wideImage: "รูปกว้าง",
            messenger: "ส่งทาง Messenger",
            line: "ส่งทาง LINE",
            copyLink: "คัดลอกลิงก์"
        },
        comment: {
            yourName: "ชื่อของคุณ",
            namePlaceholder: "ใส่ชื่อ (ไม่เกิน 15 ตัวอักษร)",
            label: "ความคิดเห็น",
            placeholder: "น้อมรับคำทำนายจากแม่หมอพิมพ์ฟ้า",
            submit: "ส่งความคิดเห็น",
            sending: "กำลังส่ง...",
            reply: "ตอบกลับ",
            replyPlaceholder: "เขียนข้อความตอบกลับ...",
            sendReply: "ส่ง"
        },
        comments: {
            title: "เรื่องเล่าจากวงไพ่ ✦",
            tabNew: "ล่าสุด",
            tabHot: "ยอดนิยม",
            tabMyCard: "ไพ่ฉัน",
            tabMine: "ของฉัน",
            empty: "ยังไม่มีความคิดเห็น",
            myComments: "ความคิดเห็นของฉัน",
            repliedTo: "ที่ฉันเคยตอบ",
            noComments: "ยังไม่ได้แสดงความคิดเห็น",
            goComment: "ไปแสดงความคิดเห็นบนไพ่ของคนอื่นกันเลย!",
            viewLatest: "ดูความคิดเห็นล่าสุด"
        },
        blessing: {
            wantMore: "อยากรู้เพิ่มเติม",
            restart: "เริ่มใหม่"
        },
        toast: {
            copied: "คัดลอกลิงก์แล้ว!",
            replySuccess: "ตอบกลับสำเร็จ",
            submitSuccess: "ส่งสำเร็จ!",
            error: "เกิดข้อผิดพลาด กรุณาลองใหม่",
            systemNotReady: "ระบบยังไม่พร้อม กรุณาลองใหม่"
        },
        common: {
            loading: "กำลังโหลด...",
            prophecy: "คำทำนาย",
            replies: "การตอบกลับ",
            beFirstReply: "✦ ตอบกลับคนแรก",
            otherComments: "ความคิดเห็นอื่นๆ บนไพ่ใบนี้",
            loadError: "ไม่สามารถโหลดความคิดเห็นได้",
            noHotComments: "ยังไม่มีความคิดเห็นยอดนิยม",
            tryReply: "ลองตอบกลับความคิดเห็นสิ!",
            replyCount: "ตอบกลับ"
        },
        time: {
            justNow: "เมื่อสักครู่",
            minutesAgo: "นาทีที่แล้ว",
            hoursAgo: "ชั่วโมงที่แล้ว",
            daysAgo: "วันที่แล้ว"
        },
        share: {
            gotCard: "ฉันจับได้ไพ่",
            letsRead: "มาดูดวงความรักวาเลนไทน์กัน!",
            title: "ดูดวงความรักวาเลนไทน์",
            copiedForMessenger: "คัดลอกข้อความแล้ว! วางใน Messenger ได้เลย",
            copiedText: "คัดลอกข้อความแล้ว!"
        },
        image: {
            selectFirst: "กรุณาเลือกไพ่ก่อน",
            creating: "กำลังสร้างรูป...",
            saved: "บันทึกรูปสำเร็จ!"
        },
        sections: {
            popular: "✦ ยอดนิยม",
            recent: "✦ ล่าสุด"
        },
        cta: {
            notAccepted: "ยังไม่ได้น้อมรับคำทำนาย",
            drawToReceive: "จับไพ่เพื่อรับคำทำนายจากแม่หมอพิมพ์ฟ้า",
            goDrawCard: "ไปจับไพ่กันเลย!",
            acceptFirst: "น้อมรับคำทำนายคนแรก",
            beFirstComment: "ยังไม่มีความคิดเห็น<br>เป็นคนแรกที่แสดงความคิดเห็นกันเถอะ!"
        },
        error: {
            cardLoadFailed: "ไม่สามารถโหลดข้อมูลไพ่ได้",
            cardNotFound: "ไม่พบข้อมูลไพ่",
            noInterpretation: "ไม่พบคำทำนายสำหรับไพ่ใบนี้"
        },
        cardview: {
            commentCount: "ความคิดเห็น",
            noCommentsOnCard: "ยังไม่มีใครแสดงความคิดเห็นบนไพ่ใบนี้",
            noOtherComments: "ยังไม่มีความคิดเห็นอื่นบนไพ่ใบนี้"
        }
    },
    en: {
        landing: {
            heading: "Who's Gonna Be My Next",
            mistake: "Mistake?",
            valentine: "Valentine!",
            loading: "Loading...",
            instruction: "Who will come into your life this Valentine's?",
            clickToDraw: "Tap card to draw"
        },
        main: {
            title: "Who will come into your life this Valentine's?",
            instruction: "Pick 1 card to see your fortune",
            loadingCards: "Loading cards..."
        },
        ranking: {
            title: "Popular Cards"
        },
        result: {
            saveImage: "Save Image:",
            share: "Share:",
            copy: "Copy",
            acceptProphecy: "Accept the Prophecy",
            hideSection: "Hide",
            view: "View",
            notSerious: "I drew it by accident",
            drawAgain: "Draw Again",
            wideImage: "Wide image",
            messenger: "Share via Messenger",
            line: "Share via LINE",
            copyLink: "Copy link"
        },
        comment: {
            yourName: "Your Name",
            namePlaceholder: "Enter name (max 15 chars)",
            label: "Comment",
            placeholder: "Accept the prophecy from fortune teller",
            submit: "Submit Comment",
            sending: "Sending...",
            reply: "Reply",
            replyPlaceholder: "Write a reply...",
            sendReply: "Send"
        },
        comments: {
            title: "Tales from the Cards ✦",
            tabNew: "Latest",
            tabHot: "Popular",
            tabMyCard: "My Card",
            tabMine: "Mine",
            empty: "No comments yet",
            myComments: "My Comments",
            repliedTo: "Replied To",
            noComments: "No comments yet",
            goComment: "Go comment on other's cards!",
            viewLatest: "View Latest Comments"
        },
        blessing: {
            wantMore: "Want to know more?",
            restart: "Start Over"
        },
        toast: {
            copied: "Link copied!",
            replySuccess: "Reply sent",
            submitSuccess: "Sent!",
            error: "An error occurred. Please try again",
            systemNotReady: "System not ready. Please try again"
        },
        common: {
            loading: "Loading...",
            prophecy: "Prophecy",
            replies: "Replies",
            beFirstReply: "✦ Be the first to reply",
            otherComments: "Other comments on this card",
            loadError: "Unable to load comments",
            noHotComments: "No popular comments yet",
            tryReply: "Try replying to a comment!",
            replyCount: "replies"
        },
        time: {
            justNow: "Just now",
            minutesAgo: "minutes ago",
            hoursAgo: "hours ago",
            daysAgo: "days ago"
        },
        share: {
            gotCard: "I got the card",
            letsRead: "Let's read Valentine love fortune!",
            title: "Valentine Love Fortune",
            copiedForMessenger: "Text copied! Paste in Messenger",
            copiedText: "Text copied!"
        },
        image: {
            selectFirst: "Please select a card first",
            creating: "Creating image...",
            saved: "Image saved!"
        },
        sections: {
            popular: "✦ Popular",
            recent: "✦ Recent"
        },
        cta: {
            notAccepted: "You haven't accepted the prophecy yet",
            drawToReceive: "Draw a card to receive your fortune",
            goDrawCard: "Let's draw a card!",
            acceptFirst: "Be the first to accept",
            beFirstComment: "No comments yet<br>Be the first to comment!"
        },
        error: {
            cardLoadFailed: "Unable to load card data",
            cardNotFound: "Card data not found",
            noInterpretation: "No interpretation found for this card"
        },
        cardview: {
            commentCount: "comments",
            noCommentsOnCard: "No one has commented on this card yet",
            noOtherComments: "No other comments on this card yet"
        }
    },
    "zh-CN": {
        landing: {
            heading: "Who's Gonna Be My Next",
            mistake: "Mistake?",
            valentine: "Valentine!",
            loading: "加载中...",
            instruction: "情人节谁会走进你的生活？",
            clickToDraw: "点击抽牌"
        },
        main: {
            title: "情人节谁会走进你的生活？",
            instruction: "选择1张牌看你的运势",
            loadingCards: "加载牌中..."
        },
        ranking: {
            title: "热门牌"
        },
        result: {
            saveImage: "保存图片：",
            share: "分享：",
            copy: "复制",
            acceptProphecy: "接受预言",
            hideSection: "隐藏",
            view: "查看",
            notSerious: "手滑了啦~",
            drawAgain: "重新抽牌",
            wideImage: "宽图",
            messenger: "分享到Messenger",
            line: "分享到LINE",
            copyLink: "复制链接"
        },
        comment: {
            yourName: "你的名字",
            namePlaceholder: "输入名字（最多15字）",
            label: "评论",
            placeholder: "接受占卜师的预言",
            submit: "提交评论",
            sending: "发送中...",
            reply: "回复",
            replyPlaceholder: "写回复...",
            sendReply: "发送"
        },
        comments: {
            title: "牌桌故事 ✦",
            tabNew: "最新",
            tabHot: "热门",
            tabMyCard: "我的牌",
            tabMine: "我的",
            empty: "暂无评论",
            myComments: "我的评论",
            repliedTo: "我回复的",
            noComments: "暂无评论",
            goComment: "去给别人的牌评论吧！",
            viewLatest: "查看最新评论"
        },
        blessing: {
            wantMore: "想了解更多？",
            restart: "重新开始"
        },
        toast: {
            copied: "链接已复制！",
            replySuccess: "回复成功",
            submitSuccess: "发送成功！",
            error: "出错了，请重试",
            systemNotReady: "系统未准备好，请重试"
        },
        common: {
            loading: "加载中...",
            prophecy: "预言",
            replies: "回复",
            beFirstReply: "✦ 成为第一个回复",
            otherComments: "该牌的其他评论",
            loadError: "无法加载评论",
            noHotComments: "还没有热门评论",
            tryReply: "试着回复一条评论吧！",
            replyCount: "回复"
        },
        time: {
            justNow: "刚刚",
            minutesAgo: "分钟前",
            hoursAgo: "小时前",
            daysAgo: "天前"
        },
        share: {
            gotCard: "我抽到了",
            letsRead: "一起来看情人节爱情运势吧！",
            title: "情人节爱情运势",
            copiedForMessenger: "已复制文字！请粘贴到Messenger",
            copiedText: "已复制文字！"
        },
        image: {
            selectFirst: "请先选择一张牌",
            creating: "正在生成图片...",
            saved: "图片保存成功！"
        },
        sections: {
            popular: "✦ 热门",
            recent: "✦ 最新"
        },
        cta: {
            notAccepted: "你还没有接受预言",
            drawToReceive: "抽一张牌来获取你的运势",
            goDrawCard: "去抽牌吧！",
            acceptFirst: "成为第一个接受的人",
            beFirstComment: "暂无评论<br>来成为第一个评论的人吧！"
        },
        error: {
            cardLoadFailed: "无法加载牌数据",
            cardNotFound: "找不到牌数据",
            noInterpretation: "找不到这张牌的解读"
        },
        cardview: {
            commentCount: "条评论",
            noCommentsOnCard: "还没有人在这张牌上评论",
            noOtherComments: "这张牌上还没有其他评论"
        }
    },
    "zh-TW": {
        landing: {
            heading: "Who's Gonna Be My Next",
            mistake: "Mistake?",
            valentine: "Valentine!",
            loading: "載入中...",
            instruction: "情人節誰會走進你的生活？",
            clickToDraw: "點擊抽牌"
        },
        main: {
            title: "情人節誰會走進你的生活？",
            instruction: "選擇1張牌看你的運勢",
            loadingCards: "載入牌中..."
        },
        ranking: {
            title: "熱門牌"
        },
        result: {
            saveImage: "儲存圖片：",
            share: "分享：",
            copy: "複製",
            acceptProphecy: "接受預言",
            hideSection: "隱藏",
            view: "查看",
            notSerious: "手滑了啦~",
            drawAgain: "重新抽牌",
            wideImage: "寬圖",
            messenger: "分享到Messenger",
            line: "分享到LINE",
            copyLink: "複製連結"
        },
        comment: {
            yourName: "你的名字",
            namePlaceholder: "輸入名字（最多15字）",
            label: "評論",
            placeholder: "接受占卜師的預言",
            submit: "提交評論",
            sending: "發送中...",
            reply: "回覆",
            replyPlaceholder: "寫回覆...",
            sendReply: "發送"
        },
        comments: {
            title: "牌桌故事 ✦",
            tabNew: "最新",
            tabHot: "熱門",
            tabMyCard: "我的牌",
            tabMine: "我的",
            empty: "暫無評論",
            myComments: "我的評論",
            repliedTo: "我回覆的",
            noComments: "暫無評論",
            goComment: "去給別人的牌評論吧！",
            viewLatest: "查看最新評論"
        },
        blessing: {
            wantMore: "想了解更多？",
            restart: "重新開始"
        },
        toast: {
            copied: "連結已複製！",
            replySuccess: "回覆成功",
            submitSuccess: "發送成功！",
            error: "出錯了，請重試",
            systemNotReady: "系統未準備好，請重試"
        },
        common: {
            loading: "載入中...",
            prophecy: "預言",
            replies: "回覆",
            beFirstReply: "✦ 成為第一個回覆",
            otherComments: "該牌的其他評論",
            loadError: "無法載入評論",
            noHotComments: "還沒有熱門評論",
            tryReply: "試著回覆一條評論吧！",
            replyCount: "回覆"
        },
        time: {
            justNow: "剛剛",
            minutesAgo: "分鐘前",
            hoursAgo: "小時前",
            daysAgo: "天前"
        },
        share: {
            gotCard: "我抽到了",
            letsRead: "一起來看情人節愛情運勢吧！",
            title: "情人節愛情運勢",
            copiedForMessenger: "已複製文字！請貼到Messenger",
            copiedText: "已複製文字！"
        },
        image: {
            selectFirst: "請先選擇一張牌",
            creating: "正在產生圖片...",
            saved: "圖片儲存成功！"
        },
        sections: {
            popular: "✦ 熱門",
            recent: "✦ 最新"
        },
        cta: {
            notAccepted: "你還沒有接受預言",
            drawToReceive: "抽一張牌來獲取你的運勢",
            goDrawCard: "去抽牌吧！",
            acceptFirst: "成為第一個接受的人",
            beFirstComment: "暫無評論<br>來成為第一個評論的人吧！"
        },
        error: {
            cardLoadFailed: "無法載入牌資料",
            cardNotFound: "找不到牌資料",
            noInterpretation: "找不到這張牌的解讀"
        },
        cardview: {
            commentCount: "則評論",
            noCommentsOnCard: "還沒有人在這張牌上評論",
            noOtherComments: "這張牌上還沒有其他評論"
        }
    },
    ko: {
        landing: {
            heading: "Who's Gonna Be My Next",
            mistake: "Mistake?",
            valentine: "Valentine!",
            loading: "로딩 중...",
            instruction: "발렌타인에 누가 당신의 삶에 들어올까요?",
            clickToDraw: "카드를 탭하여 뽑기"
        },
        main: {
            title: "발렌타인에 누가 당신의 삶에 들어올까요?",
            instruction: "운세를 보려면 카드 1장을 선택하세요",
            loadingCards: "카드 로딩 중..."
        },
        ranking: {
            title: "인기 카드"
        },
        result: {
            saveImage: "이미지 저장:",
            share: "공유:",
            copy: "복사",
            acceptProphecy: "예언 받아들이기",
            hideSection: "숨기기",
            view: "보기",
            notSerious: "실수로 뽑았어요~",
            drawAgain: "다시 뽑기",
            wideImage: "와이드 이미지",
            messenger: "메신저로 공유",
            line: "LINE으로 공유",
            copyLink: "링크 복사"
        },
        comment: {
            yourName: "이름",
            namePlaceholder: "이름 입력 (최대 15자)",
            label: "댓글",
            placeholder: "점술사의 예언을 받아들이세요",
            submit: "댓글 달기",
            sending: "전송 중...",
            reply: "답글",
            replyPlaceholder: "답글 작성...",
            sendReply: "전송"
        },
        comments: {
            title: "카드의 이야기 ✦",
            tabNew: "최신",
            tabHot: "인기",
            tabMyCard: "내 카드",
            tabMine: "내 것",
            empty: "댓글이 없습니다",
            myComments: "내 댓글",
            repliedTo: "내가 답글 단",
            noComments: "댓글이 없습니다",
            goComment: "다른 사람의 카드에 댓글을 달아보세요!",
            viewLatest: "최신 댓글 보기"
        },
        blessing: {
            wantMore: "더 알고 싶으세요?",
            restart: "다시 시작"
        },
        toast: {
            copied: "링크 복사됨!",
            replySuccess: "답글 완료",
            submitSuccess: "전송 완료!",
            error: "오류가 발생했습니다. 다시 시도해 주세요",
            systemNotReady: "시스템 준비 중입니다. 다시 시도해 주세요"
        },
        common: {
            loading: "로딩 중...",
            prophecy: "예언",
            replies: "답글",
            beFirstReply: "✦ 첫 번째 답글 달기",
            otherComments: "이 카드의 다른 댓글",
            loadError: "댓글을 불러올 수 없습니다",
            noHotComments: "인기 댓글이 아직 없습니다",
            tryReply: "댓글에 답글을 달아보세요!",
            replyCount: "답글"
        },
        time: {
            justNow: "방금 전",
            minutesAgo: "분 전",
            hoursAgo: "시간 전",
            daysAgo: "일 전"
        },
        share: {
            gotCard: "나는",
            letsRead: "발렌타인 사랑 운세를 함께 봐요!",
            title: "발렌타인 사랑 운세",
            copiedForMessenger: "텍스트 복사됨! 메신저에 붙여넣기",
            copiedText: "텍스트 복사됨!"
        },
        image: {
            selectFirst: "먼저 카드를 선택해주세요",
            creating: "이미지 생성 중...",
            saved: "이미지 저장 완료!"
        },
        sections: {
            popular: "✦ 인기",
            recent: "✦ 최신"
        },
        cta: {
            notAccepted: "아직 예언을 받지 않았어요",
            drawToReceive: "카드를 뽑아 운세를 받아보세요",
            goDrawCard: "카드 뽑으러 가기!",
            acceptFirst: "첫 번째로 받기",
            beFirstComment: "아직 댓글이 없어요<br>첫 번째 댓글을 남겨보세요!"
        },
        error: {
            cardLoadFailed: "카드 데이터를 불러올 수 없습니다",
            cardNotFound: "카드 데이터를 찾을 수 없습니다",
            noInterpretation: "이 카드의 해석을 찾을 수 없습니다"
        },
        cardview: {
            commentCount: "개의 댓글",
            noCommentsOnCard: "아직 이 카드에 댓글이 없습니다",
            noOtherComments: "이 카드에 다른 댓글이 없습니다"
        }
    },
    ja: {
        landing: {
            heading: "Who's Gonna Be My Next",
            mistake: "Mistake?",
            valentine: "Valentine!",
            loading: "読み込み中...",
            instruction: "バレンタインに誰があなたの人生に入ってくる？",
            clickToDraw: "カードをタップして引く"
        },
        main: {
            title: "バレンタインに誰があなたの人生に入ってくる？",
            instruction: "運勢を見るためにカードを1枚選んでください",
            loadingCards: "カードを読み込み中..."
        },
        ranking: {
            title: "人気カード"
        },
        result: {
            saveImage: "画像を保存：",
            share: "シェア：",
            copy: "コピー",
            acceptProphecy: "予言を受け入れる",
            hideSection: "隠す",
            view: "見る",
            notSerious: "手が滑った~",
            drawAgain: "もう一度引く",
            wideImage: "ワイド画像",
            messenger: "メッセンジャーでシェア",
            line: "LINEでシェア",
            copyLink: "リンクをコピー"
        },
        comment: {
            yourName: "名前",
            namePlaceholder: "名前を入力（最大15文字）",
            label: "コメント",
            placeholder: "占い師の予言を受け入れる",
            submit: "コメント送信",
            sending: "送信中...",
            reply: "返信",
            replyPlaceholder: "返信を書く...",
            sendReply: "送信"
        },
        comments: {
            title: "カードの物語 ✦",
            tabNew: "最新",
            tabHot: "人気",
            tabMyCard: "私のカード",
            tabMine: "私の",
            empty: "コメントはまだありません",
            myComments: "私のコメント",
            repliedTo: "返信した",
            noComments: "コメントはまだありません",
            goComment: "他の人のカードにコメントしよう！",
            viewLatest: "最新コメントを見る"
        },
        blessing: {
            wantMore: "もっと知りたい？",
            restart: "やり直す"
        },
        toast: {
            copied: "リンクをコピーしました！",
            replySuccess: "返信完了",
            submitSuccess: "送信完了！",
            error: "エラーが発生しました。もう一度お試しください",
            systemNotReady: "システムの準備ができていません。もう一度お試しください"
        },
        common: {
            loading: "読み込み中...",
            prophecy: "予言",
            replies: "返信",
            beFirstReply: "✦ 最初に返信する",
            otherComments: "このカードの他のコメント",
            loadError: "コメントを読み込めません",
            noHotComments: "人気コメントはまだありません",
            tryReply: "コメントに返信してみましょう！",
            replyCount: "返信"
        },
        time: {
            justNow: "たった今",
            minutesAgo: "分前",
            hoursAgo: "時間前",
            daysAgo: "日前"
        },
        share: {
            gotCard: "私のカードは",
            letsRead: "バレンタインの恋愛運を見てみよう！",
            title: "バレンタイン恋愛運",
            copiedForMessenger: "テキストをコピーしました！メッセンジャーに貼り付けてください",
            copiedText: "テキストをコピーしました！"
        },
        image: {
            selectFirst: "先にカードを選んでください",
            creating: "画像を作成中...",
            saved: "画像を保存しました！"
        },
        sections: {
            popular: "✦ 人気",
            recent: "✦ 最新"
        },
        cta: {
            notAccepted: "まだ予言を受け入れていません",
            drawToReceive: "カードを引いて運勢を見てください",
            goDrawCard: "カードを引きに行こう！",
            acceptFirst: "最初に受け入れる",
            beFirstComment: "コメントはまだありません<br>最初のコメントを書いてみましょう！"
        },
        error: {
            cardLoadFailed: "カードデータを読み込めません",
            cardNotFound: "カードデータが見つかりません",
            noInterpretation: "このカードの解釈が見つかりません"
        },
        cardview: {
            commentCount: "件のコメント",
            noCommentsOnCard: "まだこのカードにコメントがありません",
            noOtherComments: "このカードに他のコメントはありません"
        }
    },
    fr: {
        landing: {
            heading: "Who's Gonna Be My Next",
            mistake: "Mistake?",
            valentine: "Valentine!",
            loading: "Chargement...",
            instruction: "Qui entrera dans votre vie pour la Saint-Valentin ?",
            clickToDraw: "Touchez la carte pour tirer"
        },
        main: {
            title: "Qui entrera dans votre vie pour la Saint-Valentin ?",
            instruction: "Choisissez 1 carte pour voir votre prédiction",
            loadingCards: "Chargement des cartes..."
        },
        ranking: {
            title: "Cartes populaires"
        },
        result: {
            saveImage: "Enregistrer :",
            share: "Partager :",
            copy: "Copier",
            acceptProphecy: "Accepter la prophétie",
            hideSection: "Masquer",
            view: "Voir",
            notSerious: "Oups, main glissée~",
            drawAgain: "Retirer",
            wideImage: "Image large",
            messenger: "Partager via Messenger",
            line: "Partager via LINE",
            copyLink: "Copier le lien"
        },
        comment: {
            yourName: "Votre nom",
            namePlaceholder: "Entrez votre nom (max 15 caractères)",
            label: "Commentaire",
            placeholder: "Acceptez la prophétie de la voyante",
            submit: "Envoyer",
            sending: "Envoi en cours...",
            reply: "Répondre",
            replyPlaceholder: "Écrivez votre réponse...",
            sendReply: "Envoyer"
        },
        comments: {
            title: "Histoires du cercle de tarot ✦",
            tabNew: "Récent",
            tabHot: "Populaire",
            tabMyCard: "Ma carte",
            tabMine: "Mes posts",
            empty: "Pas encore de commentaires",
            myComments: "Mes commentaires",
            repliedTo: "Mes réponses",
            noComments: "Vous n'avez pas encore commenté",
            goComment: "Allez commenter les cartes des autres !",
            viewLatest: "Voir les derniers"
        },
        blessing: {
            wantMore: "En savoir plus",
            restart: "Recommencer"
        },
        toast: {
            copied: "Lien copié !",
            replySuccess: "Réponse envoyée",
            submitSuccess: "Envoyé avec succès !",
            error: "Erreur, veuillez réessayer",
            systemNotReady: "Système pas prêt, réessayez"
        },
        common: {
            loading: "Chargement...",
            prophecy: "Prophétie",
            replies: "Réponses",
            beFirstReply: "✦ Soyez le premier à répondre",
            otherComments: "Autres commentaires sur cette carte",
            loadError: "Impossible de charger les commentaires",
            noHotComments: "Pas encore de commentaires populaires",
            tryReply: "Essayez de répondre à un commentaire !",
            replyCount: "réponses"
        },
        time: {
            justNow: "À l'instant",
            minutesAgo: "min",
            hoursAgo: "h",
            daysAgo: "j"
        },
        share: {
            gotCard: "J'ai tiré la carte",
            letsRead: "Découvrez votre horoscope amoureux de Saint-Valentin !",
            title: "Horoscope amoureux Saint-Valentin",
            copiedForMessenger: "Texte copié ! Collez dans Messenger",
            copiedText: "Texte copié !"
        },
        image: {
            selectFirst: "Veuillez d'abord choisir une carte",
            creating: "Création de l'image...",
            saved: "Image enregistrée !"
        },
        sections: {
            popular: "✦ Populaire",
            recent: "✦ Récent"
        },
        cta: {
            notAccepted: "Prophétie pas encore acceptée",
            drawToReceive: "Tirez une carte pour recevoir votre prédiction",
            goDrawCard: "Allons tirer une carte !",
            acceptFirst: "Accepter en premier",
            beFirstComment: "Pas encore de commentaires<br>Soyez le premier à commenter !"
        },
        error: {
            cardLoadFailed: "Impossible de charger les données",
            cardNotFound: "Carte introuvable",
            noInterpretation: "Interprétation non trouvée"
        },
        cardview: {
            commentCount: "commentaires",
            noCommentsOnCard: "Pas encore de commentaires sur cette carte",
            noOtherComments: "Pas d'autres commentaires sur cette carte"
        }
    }
};

// ========================================
// Card Name Translations (Major Arcana)
// ========================================
// Card names are kept in English for all languages
const cardNameTranslations = {};

// ========================================
// Card Interpretations (All 78 Cards)
// Card interpretations are loaded from a separate file
// to keep this file manageable
// ========================================
// Note: cardInterpretations is defined in js/card-interpretations.js
