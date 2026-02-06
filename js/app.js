// Valentine Tarot - Main Application Script

let tarotData = null;
let selectedCardElement = null;
let isAnimating = false;
let isPageReady = false;

// ========================================
// Internationalization (i18n)
// ========================================
let currentLang = 'th';

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
            notSerious: "Just kidding",
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
            notSerious: "开玩笑的",
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
            notSerious: "開玩笑的",
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
            notSerious: "농담이에요",
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
            notSerious: "冗談です",
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
    }
};

// Card name translations (Major Arcana)
const cardNameTranslations = {
    "THE FOOL": { ja: "愚者", ko: "바보", "zh-CN": "愚人", "zh-TW": "愚人" },
    "THE MAGICIAN": { ja: "魔術師", ko: "마법사", "zh-CN": "魔术师", "zh-TW": "魔術師" },
    "THE HIGH PRIESTESS": { ja: "女教皇", ko: "여사제", "zh-CN": "女祭司", "zh-TW": "女祭司" },
    "THE EMPRESS": { ja: "女帝", ko: "여황제", "zh-CN": "女皇", "zh-TW": "女皇" },
    "THE EMPEROR": { ja: "皇帝", ko: "황제", "zh-CN": "皇帝", "zh-TW": "皇帝" },
    "THE HIEROPHANT": { ja: "教皇", ko: "교황", "zh-CN": "教皇", "zh-TW": "教皇" },
    "THE LOVERS": { ja: "恋人", ko: "연인", "zh-CN": "恋人", "zh-TW": "戀人" },
    "THE CHARIOT": { ja: "戦車", ko: "전차", "zh-CN": "战车", "zh-TW": "戰車" },
    "STRENGTH": { ja: "力", ko: "힘", "zh-CN": "力量", "zh-TW": "力量" },
    "THE HERMIT": { ja: "隠者", ko: "은둔자", "zh-CN": "隐士", "zh-TW": "隱士" },
    "WHEEL OF FORTUNE": { ja: "運命の輪", ko: "운명의 수레바퀴", "zh-CN": "命运之轮", "zh-TW": "命運之輪" },
    "JUSTICE": { ja: "正義", ko: "정의", "zh-CN": "正义", "zh-TW": "正義" },
    "THE HANGED MAN": { ja: "吊された男", ko: "매달린 남자", "zh-CN": "倒吊人", "zh-TW": "倒吊人" },
    "DEATH": { ja: "死神", ko: "죽음", "zh-CN": "死神", "zh-TW": "死神" },
    "TEMPERANCE": { ja: "節制", ko: "절제", "zh-CN": "节制", "zh-TW": "節制" },
    "THE DEVIL": { ja: "悪魔", ko: "악마", "zh-CN": "恶魔", "zh-TW": "惡魔" },
    "THE TOWER": { ja: "塔", ko: "탑", "zh-CN": "高塔", "zh-TW": "高塔" },
    "THE STAR": { ja: "星", ko: "별", "zh-CN": "星星", "zh-TW": "星星" },
    "THE MOON": { ja: "月", ko: "달", "zh-CN": "月亮", "zh-TW": "月亮" },
    "THE SUN": { ja: "太陽", ko: "태양", "zh-CN": "太阳", "zh-TW": "太陽" },
    "JUDGEMENT": { ja: "審判", ko: "심판", "zh-CN": "审判", "zh-TW": "審判" },
    "THE WORLD": { ja: "世界", ko: "세계", "zh-CN": "世界", "zh-TW": "世界" }
};

// Get translated card name
function getCardName(englishName) {
    if (currentLang === 'th' || currentLang === 'en') {
        return englishName;
    }
    const trans = cardNameTranslations[englishName];
    return trans && trans[currentLang] ? trans[currentLang] : englishName;
}

// Card interpretation translations (Major Arcana summary versions)
const cardInterpretations = {
    "THE FOOL": {
        en: {
            quote: "Someone unprepared for commitment, still finding themselves",
            interpretation: "Someone who isn't ready for a serious relationship. If they're willing to commit, they've likely just come out of a relationship. They may come unexpectedly, fun-loving but unsure of what they truly want. They often lack clear goals in relationships."
        },
        ja: {
            quote: "まだ自分を探している、コミットメントの準備ができていない人",
            interpretation: "真剣な関係の準備ができていない人です。もし彼らがコミットする意思があるなら、おそらく最近関係から抜け出したばかりです。予期せず現れ、楽しいけれど本当に何を望んでいるかわからない人かもしれません。"
        },
        ko: {
            quote: "아직 자신을 찾고 있는, 헌신할 준비가 되지 않은 사람",
            interpretation: "진지한 관계를 맺을 준비가 되지 않은 사람입니다. 만약 그들이 헌신할 의향이 있다면, 최근에 관계에서 막 벗어났을 가능성이 높습니다. 예상치 못하게 나타나 재미있지만 진정으로 원하는 것이 무엇인지 모르는 사람일 수 있습니다."
        },
        "zh-CN": {
            quote: "还没准备好承诺，仍在寻找自我的人",
            interpretation: "这是一个还没准备好认真恋爱的人。如果他们愿意承诺，可能刚从一段感情中走出来。他们可能会意外出现，虽然有趣但不确定自己真正想要什么。"
        },
        "zh-TW": {
            quote: "還沒準備好承諾，仍在尋找自我的人",
            interpretation: "這是一個還沒準備好認真戀愛的人。如果他們願意承諾，可能剛從一段感情中走出來。他們可能會意外出現，雖然有趣但不確定自己真正想要什麼。"
        }
    },
    "THE MAGICIAN": {
        en: {
            quote: "A charming person with many talents, desired by many",
            interpretation: "A charming, talented person who is well-known. They may work as a specialist or professional such as doctor, lawyer, engineer, or designer. This person likely has many admirers, great communication skills, and knows how to please others."
        },
        ja: {
            quote: "多くの才能を持つ魅力的な人、多くの人に求められる",
            interpretation: "よく知られている魅力的で才能のある人です。医師、弁護士、エンジニア、デザイナーなどの専門家として働いているかもしれません。この人は多くの崇拝者がいて、コミュニケーション能力が高く、他人を喜ばせる方法を知っています。"
        },
        ko: {
            quote: "많은 재능을 가진 매력적인 사람, 많은 사람들이 원하는",
            interpretation: "잘 알려진 매력적이고 재능 있는 사람입니다. 의사, 변호사, 엔지니어 또는 디자이너와 같은 전문가로 일할 수 있습니다. 이 사람은 많은 팬이 있고 의사소통 능력이 뛰어나며 다른 사람을 기쁘게 하는 방법을 알고 있습니다."
        },
        "zh-CN": {
            quote: "有魅力且多才多艺的人，受到很多人的欢迎",
            interpretation: "一个有魅力、有才华、广为人知的人。他们可能是专业人士，如医生、律师、工程师或设计师。这个人可能有很多仰慕者，沟通能力强，懂得如何取悦他人。"
        },
        "zh-TW": {
            quote: "有魅力且多才多藝的人，受到很多人的歡迎",
            interpretation: "一個有魅力、有才華、廣為人知的人。他們可能是專業人士，如醫生、律師、工程師或設計師。這個人可能有很多仰慕者，溝通能力強，懂得如何取悅他人。"
        }
    },
    "THE LOVERS": {
        en: { quote: "Someone who clicks with you from the very first meeting", interpretation: "Someone who comes with a perfect connection. You'll have chemistry from the first meeting. They may share similar values and interests with you." },
        ja: { quote: "最初の出会いからぴったり合う人", interpretation: "完璧なつながりを持って来る人です。最初の出会いから化学反応があります。" },
        ko: { quote: "첫 만남부터 잘 맞는 사람", interpretation: "완벽한 연결을 가지고 오는 사람입니다. 첫 만남부터 케미가 있을 것입니다." },
        "zh-CN": { quote: "从第一次见面就很合拍的人", interpretation: "一个带着完美连接而来的人。你们从第一次见面就会有化学反应。" },
        "zh-TW": { quote: "從第一次見面就很合拍的人", interpretation: "一個帶著完美連結而來的人。你們從第一次見面就會有化學反應。" }
    },
    "THE HIGH PRIESTESS": {
        en: { quote: "A mysterious person who may be hiding secrets", interpretation: "An introvert who works behind the scenes. They're specialized experts but hard to reach. Beware of love triangles or secret relationships." },
        ja: { quote: "秘密を隠しているかもしれない神秘的な人", interpretation: "裏方で働く内向的な人。専門家ですが、なかなか近づけません。三角関係や秘密の関係に注意。" },
        ko: { quote: "비밀을 숨기고 있을 수 있는 신비로운 사람", interpretation: "뒤에서 일하는 내성적인 사람입니다. 전문가이지만 접근하기 어렵습니다." },
        "zh-CN": { quote: "可能隐藏着秘密的神秘人", interpretation: "一个在幕后工作的内向者。是专家但很难接近。小心三角恋或秘密关系。" },
        "zh-TW": { quote: "可能隱藏著秘密的神秘人", interpretation: "一個在幕後工作的內向者。是專家但很難接近。小心三角戀或秘密關係。" }
    },
    "THE EMPRESS": {
        en: { quote: "You're already complete, anyone who enters must enhance your life", interpretation: "You're living a fulfilled life and not actively seeking love. Anyone who wants to pursue you must add value to your already comfortable single life." },
        ja: { quote: "あなたはすでに完璧、入ってくる人はあなたの人生を豊かにしなければ", interpretation: "充実した生活を送っていて、積極的に恋を求めていません。" },
        ko: { quote: "당신은 이미 완벽해요, 들어오는 사람은 당신의 삶을 향상시켜야 해요", interpretation: "이미 충만한 삶을 살고 있고 적극적으로 사랑을 찾지 않습니다." },
        "zh-CN": { quote: "你已经很完美了，进入你生活的人必须让它更好", interpretation: "你过着充实的生活，不急于寻找爱情。想追求你的人必须为你的生活增添价值。" },
        "zh-TW": { quote: "你已經很完美了，進入你生活的人必須讓它更好", interpretation: "你過著充實的生活，不急於尋找愛情。想追求你的人必須為你的生活增添價值。" }
    },
    "THE EMPEROR": {
        en: { quote: "A powerful leader who provides stability", interpretation: "Someone with authority and leadership. May hold a high position at work or have a stable life. They like rules and order, may seem strict but provide security." },
        ja: { quote: "安定を与える力強いリーダー", interpretation: "権威とリーダーシップを持つ人。厳格に見えるかもしれませんが、安定を与えます。" },
        ko: { quote: "안정을 주는 강력한 리더", interpretation: "권위와 리더십을 가진 사람입니다. 엄격해 보일 수 있지만 안정감을 줍니다." },
        "zh-CN": { quote: "提供稳定的强大领导者", interpretation: "有权威和领导力的人。可能看起来严格，但能提供安全感。" },
        "zh-TW": { quote: "提供穩定的強大領導者", interpretation: "有權威和領導力的人。可能看起來嚴格，但能提供安全感。" }
    },
    "THE HIEROPHANT": {
        en: { quote: "A good advisor, but doesn't give you special attention", interpretation: "Someone who comes as a counselor but treats everyone equally. They don't give you special treatment. Could be a teacher, mentor, or elder who gives advice." },
        ja: { quote: "良いアドバイザーだが、特別扱いはしない", interpretation: "アドバイザーとして来るが、みんなに平等に接する人です。" },
        ko: { quote: "좋은 조언자지만 특별한 관심은 주지 않아요", interpretation: "조언자로 오지만 모두를 평등하게 대하는 사람입니다." },
        "zh-CN": { quote: "好顾问，但不会特别关注你", interpretation: "作为顾问出现但对每个人都一视同仁的人。不会给你特殊待遇。" },
        "zh-TW": { quote: "好顧問，但不會特別關注你", interpretation: "作為顧問出現但對每個人都一視同仁的人。不會給你特殊待遇。" }
    },
    "THE CHARIOT": {
        en: { quote: "A determined person who knows what they want", interpretation: "Someone with ambition and drive who knows their goals. They may be successful, have leadership qualities, and high energy. Could be someone who travels frequently." },
        ja: { quote: "自分が何を望んでいるかを知っている決意のある人", interpretation: "野心と意欲を持ち、目標を知っている人です。" },
        ko: { quote: "자신이 원하는 것을 아는 결단력 있는 사람", interpretation: "야망과 추진력을 가지고 목표를 아는 사람입니다." },
        "zh-CN": { quote: "知道自己想要什么的坚定的人", interpretation: "有野心和动力，知道自己目标的人。可能很成功，有领导力。" },
        "zh-TW": { quote: "知道自己想要什麼的堅定的人", interpretation: "有野心和動力，知道自己目標的人。可能很成功，有領導力。" }
    },
    "STRENGTH": {
        en: { quote: "Someone who needs your help and encouragement", interpretation: "Someone already in your life who may need support. Could be a close friend or someone going through problems who needs encouragement and care from you." },
        ja: { quote: "あなたの助けと励ましを必要とする人", interpretation: "すでにあなたの人生にいる、サポートを必要としている人かもしれません。" },
        ko: { quote: "당신의 도움과 격려가 필요한 사람", interpretation: "이미 당신의 삶에 있는, 지원이 필요한 사람일 수 있습니다." },
        "zh-CN": { quote: "需要你帮助和鼓励的人", interpretation: "可能是已经在你生活中需要支持的人。可能正在经历问题，需要你的鼓励和关心。" },
        "zh-TW": { quote: "需要你幫助和鼓勵的人", interpretation: "可能是已經在你生活中需要支持的人。可能正在經歷問題，需要你的鼓勵和關心。" }
    },
    "THE HERMIT": {
        en: { quote: "Someone from your past with shared memories", interpretation: "Someone you still have feelings and memories with. Could be an ex, someone you used to talk to, or someone who was meaningful in the past." },
        ja: { quote: "共有の思い出を持つ過去の人", interpretation: "まだ感情と思い出を共有している人です。元カレ・元カノかもしれません。" },
        ko: { quote: "공유된 추억을 가진 과거의 사람", interpretation: "아직 감정과 추억을 공유하는 사람입니다. 전 애인일 수 있습니다." },
        "zh-CN": { quote: "有共同回忆的过去的人", interpretation: "你仍然有感情和回忆的人。可能是前任或过去有意义的人。" },
        "zh-TW": { quote: "有共同回憶的過去的人", interpretation: "你仍然有感情和回憶的人。可能是前任或過去有意義的人。" }
    },
    "WHEEL OF FORTUNE": {
        en: { quote: "Someone who comes unexpectedly, everything is still uncertain", interpretation: "Someone who comes unexpectedly or an ex returning. You might meet through dating apps or social media. Still an uncertain period, not ready for anything serious." },
        ja: { quote: "予期せず来る人、すべてはまだ不確定", interpretation: "予期せず来る人か、戻ってくる元カレ・元カノ。まだ不確定な時期です。" },
        ko: { quote: "예상치 못하게 오는 사람, 모든 것이 아직 불확실", interpretation: "예상치 못하게 오는 사람이거나 돌아오는 전 애인입니다." },
        "zh-CN": { quote: "意外出现的人，一切仍不确定", interpretation: "意外出现的人或回来的前任。可能通过约会app或社交媒体认识。仍是不确定的时期。" },
        "zh-TW": { quote: "意外出現的人，一切仍不確定", interpretation: "意外出現的人或回來的前任。可能通過約會app或社交媒體認識。仍是不確定的時期。" }
    },
    "JUSTICE": {
        en: { quote: "A time of decision-making and weighing options", interpretation: "No one is coming in, but someone is distancing themselves. The relationship is in a waiting period. The other person may be deciding whether to leave their current partner." },
        ja: { quote: "決断と選択肢を比較する時", interpretation: "誰も入ってこないが、誰かが距離を置いている。関係は待機期間にあります。" },
        ko: { quote: "결정과 선택을 저울질하는 시간", interpretation: "아무도 들어오지 않지만, 누군가가 거리를 두고 있습니다." },
        "zh-CN": { quote: "做决定和权衡的时期", interpretation: "没有人进来，但有人在疏远。关系处于等待期。对方可能在决定是否离开现任。" },
        "zh-TW": { quote: "做決定和權衡的時期", interpretation: "沒有人進來，但有人在疏遠。關係處於等待期。對方可能在決定是否離開現任。" }
    },
    "THE HANGED MAN": {
        en: { quote: "A period of waiting and obstacles", interpretation: "You're not ready to meet anyone. You may have just gone through disappointment or illness. If someone comes, they might have problems of their own." },
        ja: { quote: "待機と障害の時期", interpretation: "誰にも会う準備ができていません。失望や病気を経験したばかりかもしれません。" },
        ko: { quote: "기다림과 장애물의 시기", interpretation: "누구도 만날 준비가 되어 있지 않습니다. 실망이나 병을 겪었을 수 있습니다." },
        "zh-CN": { quote: "等待和障碍的时期", interpretation: "你还没准备好见任何人。可能刚经历过失望或生病。如果有人来，他们可能也有自己的问题。" },
        "zh-TW": { quote: "等待和障礙的時期", interpretation: "你還沒準備好見任何人。可能剛經歷過失望或生病。如果有人來，他們可能也有自己的問題。" }
    },
    "DEATH": {
        en: { quote: "A period of endings and transformation", interpretation: "A time of change and sadness, not suitable for new beginnings. You need to clear old things first. If someone comes, it might be an ex who brings more pain." },
        ja: { quote: "終わりと変容の時期", interpretation: "変化と悲しみの時期で、新しい始まりには向いていません。" },
        ko: { quote: "끝남과 변화의 시기", interpretation: "변화와 슬픔의 시기로, 새로운 시작에는 적합하지 않습니다." },
        "zh-CN": { quote: "结束和转变的时期", interpretation: "变化和悲伤的时期，不适合新的开始。需要先清理旧事物。如果有人来，可能是带来更多痛苦的前任。" },
        "zh-TW": { quote: "結束和轉變的時期", interpretation: "變化和悲傷的時期，不適合新的開始。需要先清理舊事物。如果有人來，可能是帶來更多痛苦的前任。" }
    },
    "TEMPERANCE": {
        en: { quote: "Many options, but can't decide yet", interpretation: "You might need to juggle multiple people. There are many options but you're not sure which to choose. You might have multiple dates in one day." },
        ja: { quote: "多くの選択肢があるが、まだ決められない", interpretation: "複数の人を同時に扱う必要があるかもしれません。選択肢は多いですが、どれを選ぶかわかりません。" },
        ko: { quote: "많은 선택지가 있지만 아직 결정할 수 없어요", interpretation: "여러 사람을 동시에 다뤄야 할 수도 있습니다. 선택지는 많지만 어떤 것을 선택할지 모릅니다." },
        "zh-CN": { quote: "很多选择，但还不能决定", interpretation: "你可能需要同时应对多个人。选择很多但不确定选哪个。" },
        "zh-TW": { quote: "很多選擇，但還不能決定", interpretation: "你可能需要同時應對多個人。選擇很多但不確定選哪個。" }
    },
    "THE DEVIL": {
        en: { quote: "Intense passion, but beware of someone taken", interpretation: "Someone will come and you'll be deeply attracted to each other. Strong physical chemistry and passion, but may not be good for you long-term. Beware of someone who's already taken." },
        ja: { quote: "激しい情熱、でも既婚者に注意", interpretation: "誰かが来て、お互いに深く惹かれ合います。でも長期的には良くないかも。既婚者に注意。" },
        ko: { quote: "강렬한 열정, 하지만 이미 있는 사람 조심", interpretation: "누군가 와서 서로 깊이 끌릴 것입니다. 하지만 장기적으로 좋지 않을 수 있습니다." },
        "zh-CN": { quote: "强烈的激情，但小心有主的人", interpretation: "会有人来，你们会被深深吸引。强烈的化学反应和激情，但长期可能不好。小心已经有对象的人。" },
        "zh-TW": { quote: "強烈的激情，但小心有主的人", interpretation: "會有人來，你們會被深深吸引。強烈的化學反應和激情，但長期可能不好。小心已經有對象的人。" }
    },
    "THE TOWER": {
        en: { quote: "A time for healing and rebuilding yourself", interpretation: "Better to rest your heart than let anyone in. You may have just broken up and need time to heal and rebuild yourself." },
        ja: { quote: "癒しと自分の再構築の時", interpretation: "誰かを入れるより心を休めた方がいいです。別れたばかりで、癒しと再構築の時間が必要かもしれません。" },
        ko: { quote: "치유하고 자신을 재건하는 시간", interpretation: "누군가를 들이는 것보다 마음을 쉬는 것이 좋습니다." },
        "zh-CN": { quote: "治愈和重建自己的时期", interpretation: "与其让人进入，不如让心休息。你可能刚分手，需要时间治愈和重建自己。" },
        "zh-TW": { quote: "治癒和重建自己的時期", interpretation: "與其讓人進入，不如讓心休息。你可能剛分手，需要時間治癒和重建自己。" }
    },
    "THE STAR": {
        en: { quote: "Someone good-looking and famous", interpretation: "You're starting to take better care of yourself. Someone attractive is showing interest, but you haven't decided yet. Could be someone famous or an influencer." },
        ja: { quote: "見た目が良くて有名な人", interpretation: "自分のケアを始めています。魅力的な人が興味を示していますが、まだ決めていません。" },
        ko: { quote: "잘생기고 유명한 사람", interpretation: "자신을 더 잘 돌보기 시작했습니다. 매력적인 사람이 관심을 보이고 있지만 아직 결정하지 않았습니다." },
        "zh-CN": { quote: "好看又有名的人", interpretation: "你开始更好地照顾自己。有魅力的人在表示兴趣，但你还没决定。可能是名人或网红。" },
        "zh-TW": { quote: "好看又有名的人", interpretation: "你開始更好地照顧自己。有魅力的人在表示興趣，但你還沒決定。可能是名人或網紅。" }
    },
    "THE MOON": {
        en: { quote: "An unclear and confusing relationship", interpretation: "The person coming to you now isn't your type or doesn't meet your requirements. No matter who you choose, they won't be the right one. Feeling confused and uncertain." },
        ja: { quote: "不明確で混乱した関係", interpretation: "今来る人はあなたのタイプではないか、要件を満たしていません。混乱と不安を感じています。" },
        ko: { quote: "불분명하고 혼란스러운 관계", interpretation: "지금 오는 사람은 당신의 타입이 아니거나 요구 사항을 충족하지 않습니다." },
        "zh-CN": { quote: "不清楚和混乱的关系", interpretation: "现在来的人不是你的类型或不符合你的要求。无论选谁都不会是对的人。感到困惑和不确定。" },
        "zh-TW": { quote: "不清楚和混亂的關係", interpretation: "現在來的人不是你的類型或不符合你的要求。無論選誰都不會是對的人。感到困惑和不確定。" }
    },
    "THE SUN": {
        en: { quote: "A fresh and clear new beginning", interpretation: "You're ready for a new relationship. Someone you've been talking to may have just left your life. A bright new beginning, someone may approach you directly and clearly." },
        ja: { quote: "新鮮で明確な新しい始まり", interpretation: "新しい関係の準備ができています。明るい新しい始まり、誰かが直接的にアプローチしてくるかもしれません。" },
        ko: { quote: "신선하고 명확한 새로운 시작", interpretation: "새로운 관계를 맺을 준비가 되었습니다. 밝은 새로운 시작입니다." },
        "zh-CN": { quote: "清新明确的新开始", interpretation: "你准备好开始新的关系了。一直在聊的人可能刚离开你的生活。一个明亮的新开始。" },
        "zh-TW": { quote: "清新明確的新開始", interpretation: "你準備好開始新的關係了。一直在聊的人可能剛離開你的生活。一個明亮的新開始。" }
    },
    "JUDGEMENT": {
        en: { quote: "A time for closure and new beginnings", interpretation: "A time when you might decide to end something rather than find love. A period of closure, ending old chapters rather than starting new ones." },
        ja: { quote: "終結と新しい始まりの時", interpretation: "愛を見つけるより何かを終わらせることを決める時期かもしれません。古い章を終える時期です。" },
        ko: { quote: "마무리와 새로운 시작의 시간", interpretation: "사랑을 찾기보다 무언가를 끝내기로 결정하는 시기일 수 있습니다." },
        "zh-CN": { quote: "结束和新开始的时期", interpretation: "你可能会决定结束某事而不是寻找爱情。是结束旧章节而不是开始新章节的时期。" },
        "zh-TW": { quote: "結束和新開始的時期", interpretation: "你可能會決定結束某事而不是尋找愛情。是結束舊章節而不是開始新章節的時期。" }
    },
    "THE WORLD": {
        en: { quote: "Complete in yourself, not seeking attachment", interpretation: "Best time to be alone. You're satisfied with your life and don't feel like you're missing anything." },
        ja: { quote: "自分自身で完璧、執着を求めない", interpretation: "一人でいるのに最適な時期。生活に満足しています。" },
        ko: { quote: "스스로 완벽하고 집착을 구하지 않음", interpretation: "혼자 있기에 가장 좋은 시기입니다." },
        "zh-CN": { quote: "自己就很完整，不寻求依恋", interpretation: "最适合独处的时期。你对生活很满意。" },
        "zh-TW": { quote: "自己就很完整，不尋求依戀", interpretation: "最適合獨處的時期。你對生活很滿意。" }
    },
    "PAGE OF WANDS": {
        en: { quote: "An energetic person bringing new energy", interpretation: "A younger stranger with tan skin, full of energy and enthusiasm. Loves adventure. You might meet them at events or new places within three weeks." },
        ja: { quote: "新しいエネルギーをもたらす活発な人", interpretation: "褐色の肌を持つ若い見知らぬ人で、エネルギーと熱意に満ちています。" },
        ko: { quote: "새로운 에너지를 가져오는 활기찬 사람", interpretation: "갈색 피부의 젊은 낯선 사람으로 에너지와 열정이 넘칩니다." },
        "zh-CN": { quote: "带来新能量的活力四射的人", interpretation: "一个皮肤黝黑的年轻陌生人，充满活力和热情。喜欢冒险。你可能在活动或新地方遇到他们。" },
        "zh-TW": { quote: "帶來新能量的活力四射的人", interpretation: "一個皮膚黝黑的年輕陌生人，充滿活力和熱情。喜歡冒險。" }
    },
    "KNIGHT OF WANDS": {
        en: { quote: "A freedom-lover who comes unexpectedly", interpretation: "A young adult who hasn't fully matured, still searching for life's meaning. Loves driving fast and freedom. May come without notice from another province." },
        ja: { quote: "予告なしに来る自由を愛する人", interpretation: "まだ完全に成熟していない若い大人で、人生の意味を探しています。" },
        ko: { quote: "예고 없이 오는 자유를 사랑하는 사람", interpretation: "아직 완전히 성숙하지 않은 젊은 성인으로 삶의 의미를 찾고 있습니다." },
        "zh-CN": { quote: "不期而至的自由爱好者", interpretation: "一个还没完全成熟的年轻人，还在寻找生活的意义。喜欢开快车和自由。可能从其他省份不打招呼就来。" },
        "zh-TW": { quote: "不期而至的自由愛好者", interpretation: "一個還沒完全成熟的年輕人，還在尋找生活的意義。喜歡開快車和自由。" }
    },
    "QUEEN OF WANDS": {
        en: { quote: "A good relationship but no label, unclear", interpretation: "For women: You have a crush on a close friend or waiting for someone who treats you like a partner but won't give you a status. For men: A confident woman who may be waiting for someone else." },
        ja: { quote: "良い関係だがラベルなし、不明確", interpretation: "女性向け：親友に片思いか、パートナーのように扱うがステータスをくれない人を待っています。" },
        ko: { quote: "좋은 관계이지만 라벨 없이 불분명", interpretation: "여성분: 친한 친구에게 짝사랑하거나 파트너처럼 대하지만 지위를 주지 않는 사람을 기다리고 있습니다." },
        "zh-CN": { quote: "关系好但没有名分，不清楚", interpretation: "女性：你暗恋好朋友或等待一个对你好但不给名分的人。男性：一个自信的女人可能在等别人。" },
        "zh-TW": { quote: "關係好但沒有名分，不清楚", interpretation: "女性：你暗戀好朋友或等待一個對你好但不給名分的人。男性：一個自信的女人可能在等別人。" }
    },
    "KING OF WANDS": {
        en: { quote: "A visionary leader with experience", interpretation: "A man with experience, real-world knowledge, a leader with vision. May be a businessman or executive. Often a fire sign (Aries, Leo, Sagittarius)." },
        ja: { quote: "経験豊富なビジョナリーリーダー", interpretation: "経験と実務知識を持つ男性、ビジョンを持つリーダー。火の星座かもしれません。" },
        ko: { quote: "경험 많은 비전 있는 리더", interpretation: "경험과 실무 지식을 가진 남성, 비전을 가진 리더입니다." },
        "zh-CN": { quote: "有远见和经验的领导者", interpretation: "一个有经验、有实战知识的男人，有远见的领导者。可能是商人或高管。通常是火象星座。" },
        "zh-TW": { quote: "有遠見和經驗的領導者", interpretation: "一個有經驗、有實戰知識的男人，有遠見的領導者。可能是商人或高管。" }
    },
    "PAGE OF CUPS": {
        en: { quote: "A cute person with similar tastes", interpretation: "Someone younger with good looks who loves art. The relationship can develop through shared tastes in movies, music, or hobbies." },
        ja: { quote: "似た趣味を持つかわいい人", interpretation: "見た目が良くて芸術を愛する若い人。映画、音楽、趣味を通じて関係が発展できます。" },
        ko: { quote: "비슷한 취향을 가진 귀여운 사람", interpretation: "외모가 좋고 예술을 사랑하는 젊은 사람입니다." },
        "zh-CN": { quote: "有相似品味的可爱的人", interpretation: "一个年轻、长相好、热爱艺术的人。关系可以通过共同的电影、音乐或爱好发展。" },
        "zh-TW": { quote: "有相似品味的可愛的人", interpretation: "一個年輕、長相好、熱愛藝術的人。關係可以通過共同的電影、音樂或愛好發展。" }
    },
    "KNIGHT OF CUPS": {
        en: { quote: "Romantic but no clear direction", interpretation: "A young or middle-aged person who's romantic and sociable. Knows how to make you feel special but may not have clear life goals." },
        ja: { quote: "ロマンチックだが方向性が不明確", interpretation: "ロマンチックで社交的な若い人か中年の人。特別な気分にさせますが、明確な人生目標がないかも。" },
        ko: { quote: "로맨틱하지만 방향이 불분명", interpretation: "로맨틱하고 사교적인 젊은 사람이나 중년입니다." },
        "zh-CN": { quote: "浪漫但没有明确的方向", interpretation: "一个浪漫、善于社交的年轻人或中年人。知道如何让你感到特别但可能没有明确的人生目标。" },
        "zh-TW": { quote: "浪漫但沒有明確的方向", interpretation: "一個浪漫、善於社交的年輕人或中年人。知道如何讓你感到特別但可能沒有明確的人生目標。" }
    },
    "QUEEN OF CUPS": {
        en: { quote: "Already has someone in heart, hard to open up to new people", interpretation: "For women: You have someone you're thinking about. For men: A feminine, sensitive woman who has high expectations and may be obsessed with an idol or ex." },
        ja: { quote: "すでに心に誰かがいて、新しい人に心を開きにくい", interpretation: "女性向け：考えている人がいます。男性向け：女性らしく繊細な女性で、期待が高いです。" },
        ko: { quote: "이미 마음에 누군가가 있어 새로운 사람에게 마음을 열기 어려움", interpretation: "여성분: 생각하고 있는 사람이 있습니다." },
        "zh-CN": { quote: "心里已有人，很难对新人敞开心扉", interpretation: "女性：你有在想的人。男性：一个女性化、敏感的女人，期望很高，可能迷恋偶像或前任。" },
        "zh-TW": { quote: "心裡已有人，很難對新人敞開心扉", interpretation: "女性：你有在想的人。男性：一個女性化、敏感的女人，期望很高，可能迷戀偶像或前任。" }
    },
    "KING OF CUPS": {
        en: { quote: "Experienced person who may be talking to multiple people", interpretation: "For women: Someone with lots of relationship experience, maybe divorced or a bit of a player. For men: You're still looking for the right one among your options." },
        ja: { quote: "複数の人と話しているかもしれない経験豊富な人", interpretation: "女性向け：恋愛経験が豊富な人で、離婚経験者かプレイボーイかも。" },
        ko: { quote: "여러 사람과 대화할 수 있는 경험 많은 사람", interpretation: "여성분: 연애 경험이 많은 사람으로 이혼했거나 바람둥이일 수 있습니다." },
        "zh-CN": { quote: "经验丰富的人，可能同时和多人聊天", interpretation: "女性：一个恋爱经验丰富的人，可能离过婚或有点花心。男性：你还在选项中寻找对的人。" },
        "zh-TW": { quote: "經驗豐富的人，可能同時和多人聊天", interpretation: "女性：一個戀愛經驗豐富的人，可能離過婚或有點花心。男性：你還在選項中尋找對的人。" }
    },
    "PAGE OF SWORDS": {
        en: { quote: "Someone who causes headaches more than being a lover", interpretation: "A younger person who might annoy you, likes to tease or argue. Most likely you'll encounter someone to argue with online rather than a romantic interest." },
        ja: { quote: "恋人というより頭痛の種になる人", interpretation: "イライラさせる若い人で、からかったり議論したりするのが好き。" },
        ko: { quote: "연인보다 두통을 일으키는 사람", interpretation: "짜증나게 하는 젊은 사람으로 놀리거나 논쟁하는 것을 좋아합니다." },
        "zh-CN": { quote: "带来头痛而不是爱情的人", interpretation: "一个可能惹恼你的年轻人，喜欢取笑或争论。你更可能在网上遇到争论的人而不是浪漫的对象。" },
        "zh-TW": { quote: "帶來頭痛而不是愛情的人", interpretation: "一個可能惹惱你的年輕人，喜歡取笑或爭論。" }
    },
    "KNIGHT OF SWORDS": {
        en: { quote: "A straightforward person who moves fast", interpretation: "Someone confident and proactive who moves quickly. May be a soldier, police officer, or someone who travels frequently for work." },
        ja: { quote: "素早く動く率直な人", interpretation: "自信を持って素早く動く人。軍人、警察官、または仕事でよく旅行する人かも。" },
        ko: { quote: "빠르게 움직이는 솔직한 사람", interpretation: "자신감 있고 빠르게 움직이는 사람입니다." },
        "zh-CN": { quote: "行动迅速的直接的人", interpretation: "一个自信、行动迅速的人。可能是军人、警察或经常出差的人。" },
        "zh-TW": { quote: "行動迅速的直接的人", interpretation: "一個自信、行動迅速的人。可能是軍人、警察或經常出差的人。" }
    },
    "QUEEN OF SWORDS": {
        en: { quote: "A strong person with high walls", interpretation: "For women: You push people away with harsh words. For men: You might like a strong, direct woman who has been hurt before and has her guard up." },
        ja: { quote: "高い壁を持つ強い人", interpretation: "女性向け：厳しい言葉で人を追い払います。男性向け：傷ついた経験があり警戒心の強い女性が好きかも。" },
        ko: { quote: "높은 벽을 가진 강한 사람", interpretation: "여성분: 거친 말로 사람들을 밀어냅니다." },
        "zh-CN": { quote: "有高墙的坚强的人", interpretation: "女性：你用尖刻的话推开别人。男性：你可能喜欢一个坚强、直接、曾受伤而有防备心的女人。" },
        "zh-TW": { quote: "有高牆的堅強的人", interpretation: "女性：你用尖刻的話推開別人。男性：你可能喜歡一個堅強、直接、曾受傷而有防備心的女人。" }
    },
    "KING OF SWORDS": {
        en: { quote: "A cold person who doesn't show much emotion", interpretation: "If someone is talking to you but responding slowly, they probably don't like you that much. May work in military, police, or management." },
        ja: { quote: "感情をあまり見せない冷たい人", interpretation: "話しかけてくるけど返信が遅い人は、そんなに好きじゃないかも。" },
        ko: { quote: "감정을 잘 보여주지 않는 차가운 사람", interpretation: "말을 걸지만 답장이 느린 사람은 아마 당신을 그렇게 좋아하지 않습니다." },
        "zh-CN": { quote: "不太表露感情的冷淡的人", interpretation: "如果有人和你聊天但回复很慢，他们可能不太喜欢你。可能在军队、警察或管理层工作。" },
        "zh-TW": { quote: "不太表露感情的冷淡的人", interpretation: "如果有人和你聊天但回覆很慢，他們可能不太喜歡你。" }
    },
    "PAGE OF PENTACLES": {
        en: { quote: "Beware of relationships with hidden interests", interpretation: "Someone younger, but might be a scammer or someone trying to get you to invest. Could be a junior at work. The relationship might have ulterior motives." },
        ja: { quote: "隠れた利益のある関係に注意", interpretation: "若い人だが、詐欺師か投資に誘う人かも。職場の後輩かも。関係に下心があるかも。" },
        ko: { quote: "숨겨진 이익이 있는 관계 조심", interpretation: "젊은 사람이지만 사기꾼이거나 투자를 유도하는 사람일 수 있습니다." },
        "zh-CN": { quote: "小心有隐藏利益的关系", interpretation: "一个年轻人，但可能是骗子或想让你投资的人。可能是职场后辈。关系可能有隐藏动机。" },
        "zh-TW": { quote: "小心有隱藏利益的關係", interpretation: "一個年輕人，但可能是騙子或想讓你投資的人。可能是職場後輩。" }
    },
    "KNIGHT OF PENTACLES": {
        en: { quote: "A stable person but relationship may be slow", interpretation: "Could be a colleague or someone new in your department. Reliable and stable but slow-moving. The relationship progresses slowly and isn't very romantic." },
        ja: { quote: "安定した人だが関係は遅いかも", interpretation: "同僚か部門の新人かも。信頼でき安定しているが動きが遅い。関係はゆっくり進みます。" },
        ko: { quote: "안정적인 사람이지만 관계가 느릴 수 있음", interpretation: "동료이거나 부서의 새로운 사람일 수 있습니다." },
        "zh-CN": { quote: "稳定的人但关系可能很慢", interpretation: "可能是同事或部门新人。可靠稳定但行动缓慢。关系发展缓慢，不太浪漫。" },
        "zh-TW": { quote: "穩定的人但關係可能很慢", interpretation: "可能是同事或部門新人。可靠穩定但行動緩慢。關係發展緩慢，不太浪漫。" }
    },
    "QUEEN OF PENTACLES": {
        en: { quote: "Still stuck on an ex, not opening up to new people", interpretation: "For women: You already have someone you like, still checking their stories. For men: An ex or old flame may be thinking about you." },
        ja: { quote: "まだ元カレ・元カノに執着、新しい人に心を開かない", interpretation: "女性向け：好きな人がいて、まだストーリーをチェックしています。男性向け：元カノがあなたを思っているかも。" },
        ko: { quote: "아직 전 애인에게 얽매여 새로운 사람에게 마음을 열지 않음", interpretation: "여성분: 이미 좋아하는 사람이 있고 아직 스토리를 확인하고 있습니다." },
        "zh-CN": { quote: "还沉浸在前任中，不向新人敞开心扉", interpretation: "女性：你已经有喜欢的人，还在看他们的动态。男性：前任或旧情人可能在想你。" },
        "zh-TW": { quote: "還沉浸在前任中，不向新人敞開心扉", interpretation: "女性：你已經有喜歡的人，還在看他們的動態。男性：前任或舊情人可能在想你。" }
    },
    "KING OF PENTACLES": {
        en: { quote: "A wealthy person ready to spoil you", interpretation: "For women: A wealthy man is falling for you. For men: You might need to spend money on gifts to progress the relationship." },
        ja: { quote: "あなたを甘やかす準備ができている裕福な人", interpretation: "女性向け：裕福な男性があなたに恋しています。" },
        ko: { quote: "당신을 spoil할 준비가 된 부유한 사람", interpretation: "여성분: 부유한 남성이 당신에게 반하고 있습니다." },
        "zh-CN": { quote: "准备宠你的有钱人", interpretation: "女性：一个有钱的男人正在爱上你。" },
        "zh-TW": { quote: "準備寵你的有錢人", interpretation: "女性：一個有錢的男人正在愛上你。" }
    },
    "ACE OF WANDS": {
        en: { quote: "An enthusiastic person who's clear about their intentions", interpretation: "A male who's enthusiastic about pursuing you. Someone serious about relationships, makes their move clearly. High sex drive." },
        ja: { quote: "意図が明確な熱心な人", interpretation: "あなたを積極的に追いかける男性。真剣で、はっきりとアプローチします。" },
        ko: { quote: "의도가 분명한 열정적인 사람", interpretation: "당신을 적극적으로 추구하는 남성입니다." },
        "zh-CN": { quote: "意图明确的热情的人", interpretation: "一个热情追求你的男性。对关系认真，表态清楚。" },
        "zh-TW": { quote: "意圖明確的熱情的人", interpretation: "一個熱情追求你的男性。對關係認真，表態清楚。" }
    },
    "TWO OF WANDS": {
        en: { quote: "Still hesitant, hasn't moved on from the past", interpretation: "Could be a foreigner or someone from social media. Beware of someone who's about to break up but hasn't fully ended things yet." },
        ja: { quote: "まだ迷っている、過去を乗り越えていない", interpretation: "外国人かソーシャルメディアの人かも。別れかけだがまだ完全に終わっていない人に注意。" },
        ko: { quote: "아직 망설이고 있고 과거를 극복하지 못함", interpretation: "외국인이거나 소셜 미디어의 사람일 수 있습니다." },
        "zh-CN": { quote: "还在犹豫，还没从过去走出来", interpretation: "可能是外国人或社交媒体上的人。小心快分手但还没完全结束的人。" },
        "zh-TW": { quote: "還在猶豫，還沒從過去走出來", interpretation: "可能是外國人或社交媒體上的人。小心快分手但還沒完全結束的人。" }
    },
    "THREE OF WANDS": {
        en: { quote: "Ready to start anew, waiting for opportunities", interpretation: "You've just fully moved on and are ready to meet new people. Still waiting and looking, but believe you'll find someone soon." },
        ja: { quote: "新しく始める準備ができて、機会を待っている", interpretation: "完全に乗り越えて新しい人に会う準備ができています。" },
        ko: { quote: "새로 시작할 준비가 되어 기회를 기다림", interpretation: "완전히 극복하고 새로운 사람을 만날 준비가 되었습니다." },
        "zh-CN": { quote: "准备重新开始，等待机会", interpretation: "你刚完全放下，准备好认识新人。还在等待和寻找，但相信很快会遇到。" },
        "zh-TW": { quote: "準備重新開始，等待機會", interpretation: "你剛完全放下，準備好認識新人。還在等待和尋找，但相信很快會遇到。" }
    },
    "FOUR OF WANDS": {
        en: { quote: "Love from someone close by", interpretation: "Likely to find love with a colleague or someone you see daily. For those with someone, you might go public with your relationship." },
        ja: { quote: "身近な人からの愛", interpretation: "同僚か毎日会う人と恋に落ちる可能性があります。" },
        ko: { quote: "가까운 사람의 사랑", interpretation: "동료나 매일 보는 사람과 사랑에 빠질 가능성이 있습니다." },
        "zh-CN": { quote: "来自身边人的爱", interpretation: "可能与同事或每天见面的人产生爱情。有对象的人可能会公开关系。" },
        "zh-TW": { quote: "來自身邊人的愛", interpretation: "可能與同事或每天見面的人產生愛情。有對象的人可能會公開關係。" }
    },
    "FIVE OF WANDS": {
        en: { quote: "Someone in your team or friend group", interpretation: "Mostly someone in your team, close friends, or friend group. Someone of similar age. You might get closer to someone in your circle." },
        ja: { quote: "チームや友達グループの誰か", interpretation: "主にチーム、親しい友人、またはグループの誰か。同年代の人。" },
        ko: { quote: "팀이나 친구 그룹의 누군가", interpretation: "주로 팀, 친한 친구 또는 그룹의 누군가입니다." },
        "zh-CN": { quote: "团队或朋友圈里的人", interpretation: "大多是团队里、亲密朋友或朋友圈里的人。年龄相近的人。" },
        "zh-TW": { quote: "團隊或朋友圈裡的人", interpretation: "大多是團隊裡、親密朋友或朋友圈裡的人。年齡相近的人。" }
    },
    "SIX OF WANDS": {
        en: { quote: "An ex returning or someone successful", interpretation: "Could be an old friend, someone who studied abroad and returned, or an ex 2.0. Or could be a boss or someone recently promoted." },
        ja: { quote: "戻ってくる元カレ・元カノか成功した人", interpretation: "旧友、留学から戻った人、または元カレ・元カノ2.0かも。" },
        ko: { quote: "돌아오는 전 애인 또는 성공한 사람", interpretation: "오랜 친구, 유학에서 돌아온 사람 또는 전 애인 2.0일 수 있습니다." },
        "zh-CN": { quote: "回来的前任或成功的人", interpretation: "可能是老朋友、留学回来的人或前任2.0。也可能是老板或最近升职的人。" },
        "zh-TW": { quote: "回來的前任或成功的人", interpretation: "可能是老朋友、留學回來的人或前任2.0。也可能是老闆或最近升職的人。" }
    },
    "SEVEN OF WANDS": {
        en: { quote: "Must compete with rivals", interpretation: "You've announced you're single but no one good enough has come yet. Or if someone you like has announced they're single, you have many competitors." },
        ja: { quote: "ライバルと競争しなければならない", interpretation: "独身を宣言したがまだ良い人が来ていません。または好きな人が独身を宣言したなら、ライバルが多いです。" },
        ko: { quote: "경쟁자와 경쟁해야 함", interpretation: "싱글이라고 발표했지만 아직 좋은 사람이 오지 않았습니다." },
        "zh-CN": { quote: "必须与竞争对手竞争", interpretation: "你已经宣布单身但还没有足够好的人出现。或者如果你喜欢的人宣布单身，你有很多竞争者。" },
        "zh-TW": { quote: "必須與競爭對手競爭", interpretation: "你已經宣布單身但還沒有足夠好的人出現。或者如果你喜歡的人宣布單身，你有很多競爭者。" }
    },
    "EIGHT OF WANDS": {
        en: { quote: "Love from travel or dating apps", interpretation: "You might meet someone through travel or dating apps like Tinder or Bumble. They could be from far away or require travel to meet." },
        ja: { quote: "旅行やマッチングアプリからの恋", interpretation: "旅行やTinder、Bumbleなどのアプリで出会うかも。遠くにいるか、会うには旅行が必要かも。" },
        ko: { quote: "여행이나 데이팅 앱에서의 사랑", interpretation: "여행이나 Tinder, Bumble 같은 앱에서 만날 수 있습니다." },
        "zh-CN": { quote: "来自旅行或约会app的爱情", interpretation: "你可能通过旅行或Tinder、Bumble等app认识人。他们可能来自远方或需要旅行才能见面。" },
        "zh-TW": { quote: "來自旅行或約會app的愛情", interpretation: "你可能通過旅行或Tinder、Bumble等app認識人。他們可能來自遠方或需要旅行才能見面。" }
    },
    "NINE OF WANDS": {
        en: { quote: "High walls, not ready to open up", interpretation: "You won't meet anyone new because you're an introvert with high walls. You might meet someone who's still attached or not fully over their ex." },
        ja: { quote: "高い壁、心を開く準備ができていない", interpretation: "内向的で壁が高いので新しい人に会わないでしょう。" },
        ko: { quote: "높은 벽, 마음을 열 준비가 되지 않음", interpretation: "내성적이고 벽이 높아서 새로운 사람을 만나지 않을 것입니다." },
        "zh-CN": { quote: "高墙，还没准备好敞开心扉", interpretation: "你不会遇到新人因为你是内向的人，墙很高。你可能会遇到还没分手或没完全放下前任的人。" },
        "zh-TW": { quote: "高牆，還沒準備好敞開心扉", interpretation: "你不會遇到新人因為你是內向的人，牆很高。" }
    },
    "TEN OF WANDS": {
        en: { quote: "Still holding onto an old love, won't let go", interpretation: "You won't meet anyone new because you're trying to hold onto an ex." },
        ja: { quote: "まだ古い愛にしがみついて、手放さない", interpretation: "元カレ・元カノにしがみついているので新しい人に会わないでしょう。" },
        ko: { quote: "아직 옛 사랑에 매달리고 놓지 않음", interpretation: "전 애인에게 매달리고 있어서 새로운 사람을 만나지 않을 것입니다." },
        "zh-CN": { quote: "还抓着旧爱不放", interpretation: "你不会遇到新人因为你还在挽留前任。" },
        "zh-TW": { quote: "還抓著舊愛不放", interpretation: "你不會遇到新人因為你還在挽留前任。" }
    },
    "ACE OF CUPS": {
        en: { quote: "A new love that comes naturally without effort", interpretation: "Someone will come into your life naturally. They'll ask you out, could be a stranger. Beginning of a new love with potential for depth." },
        ja: { quote: "努力なしに自然に来る新しい愛", interpretation: "誰かが自然にあなたの人生に入ってきます。新しい愛の始まり。" },
        ko: { quote: "노력 없이 자연스럽게 오는 새로운 사랑", interpretation: "누군가가 자연스럽게 당신의 삶에 들어올 것입니다." },
        "zh-CN": { quote: "不费力自然到来的新爱情", interpretation: "有人会自然地进入你的生活。他们会约你出去。新爱情的开始，有深度发展的潜力。" },
        "zh-TW": { quote: "不費力自然到來的新愛情", interpretation: "有人會自然地進入你的生活。他們會約你出去。新愛情的開始。" }
    },
    "TWO OF CUPS": {
        en: { quote: "A balanced love where both give and receive equally", interpretation: "Someone you already know or have been talking to. Good chemistry, relationship progresses quickly. A balanced, equal relationship." },
        ja: { quote: "両方が平等に与え合うバランスの取れた愛", interpretation: "すでに知っている人か話している人。相性が良く、関係は早く進みます。" },
        ko: { quote: "둘 다 평등하게 주고받는 균형 잡힌 사랑", interpretation: "이미 알고 있거나 대화하고 있는 사람입니다." },
        "zh-CN": { quote: "双方平等付出和接受的平衡的爱", interpretation: "你已经认识或正在聊的人。有化学反应，关系发展很快。平衡、平等的关系。" },
        "zh-TW": { quote: "雙方平等付出和接受的平衡的愛", interpretation: "你已經認識或正在聊的人。有化學反應，關係發展很快。" }
    },
    "THREE OF CUPS": {
        en: { quote: "Meet someone at social events, but beware of third parties", interpretation: "Might meet someone at parties, weddings, or through friends of friends. Beware of love triangles or someone who's not single." },
        ja: { quote: "社交イベントで出会う、でも第三者に注意", interpretation: "パーティー、結婚式、または友達の友達を通じて出会うかも。三角関係に注意。" },
        ko: { quote: "사교 행사에서 만나지만 제3자 조심", interpretation: "파티, 결혼식 또는 친구의 친구를 통해 만날 수 있습니다." },
        "zh-CN": { quote: "在社交活动中遇到人，但小心第三者", interpretation: "可能在派对、婚礼或通过朋友的朋友认识。小心三角恋或不是单身的人。" },
        "zh-TW": { quote: "在社交活動中遇到人，但小心第三者", interpretation: "可能在派對、婚禮或通過朋友的朋友認識。小心三角戀。" }
    },
    "FOUR OF CUPS": {
        en: { quote: "Opportunities exist but you can't see them because you're stuck in dissatisfaction", interpretation: "Someone invited you out but you're not interested. Meanwhile, the one you want isn't responding." },
        ja: { quote: "機会はあるが不満に囚われて見えない", interpretation: "誰かに誘われたが興味がない。一方、あなたが望む人は返事をしていません。" },
        ko: { quote: "기회가 있지만 불만에 사로잡혀 보이지 않음", interpretation: "누군가 데이트에 초대했지만 관심이 없습니다." },
        "zh-CN": { quote: "机会存在但因为沉浸在不满中看不到", interpretation: "有人约你出去但你不感兴趣。同时你想要的人没有回应。" },
        "zh-TW": { quote: "機會存在但因為沉浸在不滿中看不到", interpretation: "有人約你出去但你不感興趣。同時你想要的人沒有回應。" }
    },
    "FIVE OF CUPS": {
        en: { quote: "Still drowning in sadness, only seeing what's lost", interpretation: "You might be blocked by someone you like. Could be a long-distance situation. Still sad from heartbreak and can't move on." },
        ja: { quote: "まだ悲しみに溺れ、失ったものだけを見ている", interpretation: "好きな人にブロックされているかも。遠距離かも。まだ失恋から立ち直れない。" },
        ko: { quote: "아직 슬픔에 빠져 잃은 것만 보고 있음", interpretation: "좋아하는 사람에게 차단당했을 수 있습니다." },
        "zh-CN": { quote: "还沉浸在悲伤中，只看到失去的", interpretation: "你可能被喜欢的人拉黑了。可能是异地。还在心碎中无法走出来。" },
        "zh-TW": { quote: "還沉浸在悲傷中，只看到失去的", interpretation: "你可能被喜歡的人拉黑了。可能是異地。還在心碎中無法走出來。" }
    },
    "SIX OF CUPS": {
        en: { quote: "An ex returning, or a pure love like childhood", interpretation: "The person you'll date is an ex, old flame, childhood friend, or someone much older/younger than you. Romantic nostalgia." },
        ja: { quote: "戻ってくる元カレ・元カノ、または子供時代のような純粋な愛", interpretation: "デートする人は元カレ・元カノ、旧友、幼なじみ、または年の差がある人かも。" },
        ko: { quote: "돌아오는 전 애인 또는 어린 시절 같은 순수한 사랑", interpretation: "데이트할 사람은 전 애인, 옛 친구 또는 나이 차이가 많은 사람일 수 있습니다." },
        "zh-CN": { quote: "回来的前任，或像童年一样纯粹的爱", interpretation: "你会约会的人是前任、旧情人、童年朋友或年龄差很大的人。浪漫的怀旧。" },
        "zh-TW": { quote: "回來的前任，或像童年一樣純粹的愛", interpretation: "你會約會的人是前任、舊情人、童年朋友或年齡差很大的人。" }
    },
    "SEVEN OF CUPS": {
        en: { quote: "Lost in fantasy, not going out to meet people in the real world", interpretation: "You're living in fiction - novels, dramas, K-dramas. Come back to reality to find real love." },
        ja: { quote: "ファンタジーに迷い、現実世界で人に会いに行かない", interpretation: "小説やドラマの世界に生きています。現実に戻って本当の愛を見つけましょう。" },
        ko: { quote: "환상에 빠져 현실 세계에서 사람을 만나지 않음", interpretation: "소설이나 드라마의 세계에 살고 있습니다." },
        "zh-CN": { quote: "沉迷幻想，不去现实世界遇见人", interpretation: "你活在小说、电视剧、韩剧里。回到现实来找到真爱吧。" },
        "zh-TW": { quote: "沉迷幻想，不去現實世界遇見人", interpretation: "你活在小說、電視劇、韓劇裡。回到現實來找到真愛吧。" }
    },
    "EIGHT OF CUPS": {
        en: { quote: "A time of letting go and starting a new path", interpretation: "You just got out of a relationship. Good time for a trip to cleanse negative energy. Any relationship now may be temporary." },
        ja: { quote: "手放して新しい道を始める時", interpretation: "関係から出たばかりです。ネガティブなエネルギーを浄化する旅に良い時期。" },
        ko: { quote: "놓아주고 새로운 길을 시작하는 시간", interpretation: "관계에서 막 벗어났습니다. 부정적인 에너지를 정화하는 여행에 좋은 시기입니다." },
        "zh-CN": { quote: "放手并开始新道路的时期", interpretation: "你刚从一段关系中走出来。是去旅行洗净负能量的好时机。现在的关系可能只是暂时的。" },
        "zh-TW": { quote: "放手並開始新道路的時期", interpretation: "你剛從一段關係中走出來。是去旅行洗淨負能量的好時機。" }
    },
    "NINE OF CUPS": {
        en: { quote: "Meet a dating expert with good financial status", interpretation: "You'll meet someone who seems experienced at dating, possibly wealthy. Might be a Pisces. Expect good restaurants and nice dates." },
        ja: { quote: "経済的に余裕のあるデートの達人に会う", interpretation: "デートに慣れた人に会うでしょう、おそらく裕福。魚座かも。" },
        ko: { quote: "경제적으로 여유 있는 데이트 전문가를 만남", interpretation: "데이트에 경험이 많은 사람을 만날 것입니다. 부유할 수 있습니다." },
        "zh-CN": { quote: "遇到经济状况好的约会专家", interpretation: "你会遇到看起来很会约会的人，可能很有钱。可能是双鱼座。期待好餐厅和不错的约会。" },
        "zh-TW": { quote: "遇到經濟狀況好的約會專家", interpretation: "你會遇到看起來很會約會的人，可能很有錢。可能是雙魚座。" }
    },
    "TEN OF CUPS": {
        en: { quote: "Complete happiness, but beware of someone with a family", interpretation: "You'll meet someone at events or reunions. Beware of someone who already has a family." },
        ja: { quote: "完全な幸せ、でも家族持ちの人に注意", interpretation: "イベントや同窓会で出会うでしょう。" },
        ko: { quote: "완전한 행복, 하지만 가족이 있는 사람 조심", interpretation: "이벤트나 동창회에서 만날 것입니다." },
        "zh-CN": { quote: "完整的幸福，但小心有家庭的人", interpretation: "你会在活动或聚会上遇到人。小心已经有家庭的人。" },
        "zh-TW": { quote: "完整的幸福，但小心有家庭的人", interpretation: "你會在活動或聚會上遇到人。小心已經有家庭的人。" }
    },
    "ACE OF SWORDS": {
        en: { quote: "Time to cut ties with old love, not start with someone new", interpretation: "Not many opportunities to meet someone. More likely to argue with people online. A time to decisively end old relationships." },
        ja: { quote: "古い愛と縁を切る時、新しい人と始める時ではない", interpretation: "出会いの機会は少ない。オンラインで人と議論する可能性が高い。" },
        ko: { quote: "옛 사랑과 인연을 끊을 때, 새로운 사람과 시작할 때가 아님", interpretation: "만날 기회가 많지 않습니다. 온라인에서 사람들과 논쟁할 가능성이 높습니다." },
        "zh-CN": { quote: "与旧爱断绝的时候，不是与新人开始的时候", interpretation: "遇到人的机会不多。更可能在网上与人争论。是果断结束旧关系的时候。" },
        "zh-TW": { quote: "與舊愛斷絕的時候，不是與新人開始的時候", interpretation: "遇到人的機會不多。更可能在網上與人爭論。" }
    },
    "TWO OF SWORDS": {
        en: { quote: "Exhausted, not wanting to go out and meet anyone", interpretation: "You're staying home, tired. The person you like might have gone silent or blocked you. Just watching dramas alone." },
        ja: { quote: "疲れ果てて、外出して誰かに会いたくない", interpretation: "家にいて疲れています。好きな人が沈黙したかブロックしたかも。" },
        ko: { quote: "지쳐서 나가서 누구도 만나고 싶지 않음", interpretation: "집에 있고 피곤합니다. 좋아하는 사람이 연락이 끊기거나 차단했을 수 있습니다." },
        "zh-CN": { quote: "筋疲力尽，不想出门见任何人", interpretation: "你待在家里，很累。你喜欢的人可能已经沉默或拉黑你了。" },
        "zh-TW": { quote: "筋疲力盡，不想出門見任何人", interpretation: "你待在家裡，很累。你喜歡的人可能已經沉默或拉黑你了。" }
    },
    "THREE OF SWORDS": {
        en: { quote: "May see an ex with someone new", interpretation: "Beware of seeing couples together hurting your heart. You might see your ex going public with someone new." },
        ja: { quote: "元カレ・元カノが誰かと一緒にいるのを見るかも", interpretation: "カップルを見て心が痛むことに注意。元カレ・元カノが誰かと公になるのを見るかも。" },
        ko: { quote: "전 애인이 새 사람과 있는 것을 볼 수 있음", interpretation: "커플을 보며 마음이 아플 수 있습니다. 전 애인이 새 사람과 공개하는 것을 볼 수 있습니다." },
        "zh-CN": { quote: "可能看到前任和新人在一起", interpretation: "小心看到情侣在一起伤你的心。你可能会看到前任和新人公开。" },
        "zh-TW": { quote: "可能看到前任和新人在一起", interpretation: "小心看到情侶在一起傷你的心。你可能會看到前任和新人公開。" }
    },
    "FOUR OF SWORDS": {
        en: { quote: "Time to rest and take care of your health", interpretation: "You might see a doctor instead of a date. Take care of your health. Give yourself time away from old flames to move on." },
        ja: { quote: "休息して健康に気をつける時", interpretation: "デートではなく医者に会うかも。健康に気をつけて。" },
        ko: { quote: "휴식하고 건강을 돌볼 시간", interpretation: "데이트 대신 의사를 만날 수 있습니다. 건강을 돌보세요." },
        "zh-CN": { quote: "休息和照顾健康的时候", interpretation: "你可能会去看医生而不是约会。照顾好健康。给自己时间远离旧情人，继续前进。" },
        "zh-TW": { quote: "休息和照顧健康的時候", interpretation: "你可能會去看醫生而不是約會。照顧好健康。" }
    },
    "FIVE OF SWORDS": {
        en: { quote: "May meet someone who just broke up", interpretation: "Your date might get cancelled because they're meeting an ex. Or you might meet someone who just went through multiple breakups." },
        ja: { quote: "別れたばかりの人に会うかも", interpretation: "元カレ・元カノに会うためにデートがキャンセルされるかも。" },
        ko: { quote: "막 헤어진 사람을 만날 수 있음", interpretation: "전 애인을 만나기 위해 데이트가 취소될 수 있습니다." },
        "zh-CN": { quote: "可能遇到刚分手的人", interpretation: "你的约会可能被取消因为对方去见前任了。或者你可能遇到刚经历多次分手的人。" },
        "zh-TW": { quote: "可能遇到剛分手的人", interpretation: "你的約會可能被取消因為對方去見前任了。" }
    },
    "SIX OF SWORDS": {
        en: { quote: "May date at the beach or meet someone from far away", interpretation: "If you date someone, they might be from a distant country or island. Couples might go on a beach date or river cruise." },
        ja: { quote: "ビーチでデートか遠くの人に会うかも", interpretation: "デートする人は遠い国や島の出身かも。カップルはビーチデートに行くかも。" },
        ko: { quote: "해변에서 데이트하거나 먼 곳의 사람을 만날 수 있음", interpretation: "데이트하는 사람은 먼 나라나 섬 출신일 수 있습니다." },
        "zh-CN": { quote: "可能在海边约会或遇到远方的人", interpretation: "如果你约会，对方可能来自遥远的国家或岛屿。情侣可能去海边约会或河上游船。" },
        "zh-TW": { quote: "可能在海邊約會或遇到遠方的人", interpretation: "如果你約會，對方可能來自遙遠的國家或島嶼。" }
    },
    "SEVEN OF SWORDS": {
        en: { quote: "Beware of players who juggle multiple people", interpretation: "Watch out for players who date multiple people. Morning with one person, afternoon with another, evening might be your turn." },
        ja: { quote: "複数の人を同時に扱うプレイヤーに注意", interpretation: "複数の人とデートするプレイヤーに注意。朝は一人、午後は別の人、夜はあなたの番かも。" },
        ko: { quote: "여러 사람을 동시에 만나는 바람둥이 조심", interpretation: "여러 사람과 데이트하는 바람둥이를 조심하세요." },
        "zh-CN": { quote: "小心同时和多人约会的花心人", interpretation: "小心同时和多人约会的花心人。早上一个人，下午另一个人，晚上可能轮到你。" },
        "zh-TW": { quote: "小心同時和多人約會的花心人", interpretation: "小心同時和多人約會的花心人。早上一個人，下午另一個人。" }
    },
    "EIGHT OF SWORDS": {
        en: { quote: "Stuck in the past, can't move on", interpretation: "You might see a doctor. If you're healthy, you're still stuck thinking about an ex. Those shared dreams won't happen. Move on." },
        ja: { quote: "過去に囚われて、前に進めない", interpretation: "医者に会うかも。健康なら、まだ元カレ・元カノのことを考えている。前に進んで。" },
        ko: { quote: "과거에 갇혀 앞으로 나아갈 수 없음", interpretation: "의사를 만날 수 있습니다. 건강하다면 아직 전 애인을 생각하고 있습니다." },
        "zh-CN": { quote: "困在过去，无法前进", interpretation: "你可能会去看医生。如果健康，你还在想前任。那些共同的梦想不会实现了。继续前进吧。" },
        "zh-TW": { quote: "困在過去，無法前進", interpretation: "你可能會去看醫生。如果健康，你還在想前任。繼續前進吧。" }
    },
    "NINE OF SWORDS": {
        en: { quote: "Resting period, the one you like may go with someone else", interpretation: "You won't be going on dates, just resting. The person you like might go out with someone else. Long-distance lovers have timezone issues." },
        ja: { quote: "休息期間、好きな人が他の人と行くかも", interpretation: "デートはせず、休んでいるだけ。好きな人が他の人と出かけるかも。" },
        ko: { quote: "휴식 기간, 좋아하는 사람이 다른 사람과 갈 수 있음", interpretation: "데이트하지 않고 그냥 쉬고 있습니다. 좋아하는 사람이 다른 사람과 나갈 수 있습니다." },
        "zh-CN": { quote: "休息期，你喜欢的人可能和别人去", interpretation: "你不会去约会，只是休息。你喜欢的人可能和别人出去。异地恋人有时差问题。" },
        "zh-TW": { quote: "休息期，你喜歡的人可能和別人去", interpretation: "你不會去約會，只是休息。你喜歡的人可能和別人出去。" }
    },
    "TEN OF SWORDS": {
        en: { quote: "Just ended a relationship, can't move on yet", interpretation: "Probably won't meet anyone. You may have just been dumped near Valentine's Day. Or you'll meet someone who just broke up and needs comfort." },
        ja: { quote: "関係が終わったばかり、まだ乗り越えられない", interpretation: "誰にも会わないでしょう。バレンタインの近くに振られたばかりかも。" },
        ko: { quote: "관계가 막 끝났고 아직 극복할 수 없음", interpretation: "아무도 만나지 않을 것입니다. 발렌타인 근처에 차였을 수 있습니다." },
        "zh-CN": { quote: "刚结束一段关系，还无法走出来", interpretation: "可能不会遇到任何人。你可能在情人节附近被甩了。或者你会遇到刚分手需要安慰的人。" },
        "zh-TW": { quote: "剛結束一段關係，還無法走出來", interpretation: "可能不會遇到任何人。你可能在情人節附近被甩了。" }
    },
    "ACE OF PENTACLES": {
        en: { quote: "Beginning of a stable love", interpretation: "Someone financially stable or starting their own business. They might take you to nice restaurants. A stable relationship with long-term potential." },
        ja: { quote: "安定した愛の始まり", interpretation: "経済的に安定した人かビジネスを始めようとしている人。素敵なレストランに連れて行ってくれるかも。" },
        ko: { quote: "안정적인 사랑의 시작", interpretation: "경제적으로 안정된 사람이거나 사업을 시작하는 사람입니다." },
        "zh-CN": { quote: "稳定爱情的开始", interpretation: "经济稳定或正在创业的人。他们可能带你去高档餐厅。稳定的关系，有长期发展潜力。" },
        "zh-TW": { quote: "穩定愛情的開始", interpretation: "經濟穩定或正在創業的人。他們可能帶你去高檔餐廳。" }
    },
    "TWO OF PENTACLES": {
        en: { quote: "Juggling period, manage your time well", interpretation: "You'll need to juggle schedules. One date at one time, another at another time. A busy Valentine's managing multiple people." },
        ja: { quote: "やりくり期間、時間を上手に管理して", interpretation: "スケジュールをやりくりする必要があります。忙しいバレンタインになりそう。" },
        ko: { quote: "저글링 기간, 시간을 잘 관리하세요", interpretation: "일정을 조정해야 합니다. 바쁜 발렌타인이 될 것입니다." },
        "zh-CN": { quote: "周旋期，管理好你的时间", interpretation: "你需要协调时间安排。一个时间一个人，另一个时间另一个人。忙碌的情人节，要应付多个人。" },
        "zh-TW": { quote: "周旋期，管理好你的時間", interpretation: "你需要協調時間安排。忙碌的情人節。" }
    },
    "THREE OF PENTACLES": {
        en: { quote: "Group date, no one-on-one", interpretation: "You'll be working on Valentine's Day. Any date will involve other people - colleagues or company parties. No romantic one-on-one time." },
        ja: { quote: "グループデート、二人きりなし", interpretation: "バレンタインは仕事です。デートがあっても他の人も一緒。ロマンチックな二人の時間なし。" },
        ko: { quote: "그룹 데이트, 둘만의 시간 없음", interpretation: "발렌타인에 일할 것입니다. 데이트가 있어도 다른 사람들도 함께입니다." },
        "zh-CN": { quote: "群体约会，没有单独相处", interpretation: "情人节你要工作。任何约会都会有其他人——同事或公司聚会。没有浪漫的二人时光。" },
        "zh-TW": { quote: "群體約會，沒有單獨相處", interpretation: "情人節你要工作。任何約會都會有其他人。沒有浪漫的二人時光。" }
    },
    "FOUR OF PENTACLES": {
        en: { quote: "Beware of stingy people who may send bills later", interpretation: "If someone asks you out, be clear about expectations. They might be stingy and ask you to pay back later. Or you want to save money and stay home." },
        ja: { quote: "後で請求書を送るかもしれないケチな人に注意", interpretation: "誰かに誘われたら、期待を明確にして。ケチで後で払い戻しを求めるかも。" },
        ko: { quote: "나중에 청구서를 보낼 수 있는 인색한 사람 조심", interpretation: "누군가 데이트에 초대하면 기대를 명확히 하세요." },
        "zh-CN": { quote: "小心可能事后算账的小气人", interpretation: "如果有人约你出去，把期望说清楚。他们可能很小气，事后要你还钱。或者你想省钱待在家里。" },
        "zh-TW": { quote: "小心可能事後算帳的小氣人", interpretation: "如果有人約你出去，把期望說清楚。他們可能很小氣。" }
    },
    "FIVE OF PENTACLES": {
        en: { quote: "Feeling not good enough, pursuing but failing", interpretation: "You might try to ask someone out but struggle. You feel not rich enough, not pretty enough, not good enough. Low self-esteem." },
        ja: { quote: "十分ではないと感じて、追いかけても失敗", interpretation: "誰かを誘おうとしても苦労するかも。十分ではないと感じている。" },
        ko: { quote: "충분하지 않다고 느끼며 추구하지만 실패", interpretation: "누군가를 데이트에 초대하려고 하지만 힘들어합니다." },
        "zh-CN": { quote: "觉得自己不够好，追求但失败", interpretation: "你可能想约人出去但很难。觉得自己不够有钱，不够漂亮，不够好。自尊心低。" },
        "zh-TW": { quote: "覺得自己不夠好，追求但失敗", interpretation: "你可能想約人出去但很難。覺得自己不夠好。" }
    },
    "SIX OF PENTACLES": {
        en: { quote: "Meet a generous person who likes to spoil you", interpretation: "Congrats, you'll meet someone who likes to give gifts and treat you well. They're financially better off and don't mind taking care of you." },
        ja: { quote: "あなたを甘やかすのが好きな気前の良い人に会う", interpretation: "おめでとう、プレゼントをあげてよくしてくれる人に会います。" },
        ko: { quote: "당신을 spoil하는 것을 좋아하는 관대한 사람을 만남", interpretation: "축하합니다, 선물을 주고 잘 대해주는 사람을 만날 것입니다." },
        "zh-CN": { quote: "遇到喜欢宠你的慷慨的人", interpretation: "恭喜，你会遇到喜欢送礼物和对你好的人。他们经济条件好，不介意照顾你。" },
        "zh-TW": { quote: "遇到喜歡寵你的慷慨的人", interpretation: "恭喜，你會遇到喜歡送禮物和對你好的人。" }
    },
    "SEVEN OF PENTACLES": {
        en: { quote: "Waiting for someone to ask you out, but no one does", interpretation: "You're waiting for someone to message and ask you out, but no one has. Try reaching out yourself. You've invested time waiting but no results yet." },
        ja: { quote: "誰かに誘われるのを待っているが、誰もいない", interpretation: "誰かがメッセージして誘ってくれるのを待っているが、まだ誰も。自分から連絡してみて。" },
        ko: { quote: "누군가 데이트 신청하기를 기다리지만 아무도 하지 않음", interpretation: "누군가 연락해서 데이트 신청하기를 기다리지만 아무도 없습니다." },
        "zh-CN": { quote: "等人约你出去，但没有人", interpretation: "你在等人发消息约你出去，但没有人。试着自己主动联系。你投入时间等待但还没有结果。" },
        "zh-TW": { quote: "等人約你出去，但沒有人", interpretation: "你在等人發消息約你出去，但沒有人。試著自己主動聯繫。" }
    },
    "EIGHT OF PENTACLES": {
        en: { quote: "Working alone, no dates", interpretation: "No dates, just working at home alone all day. If you ask someone out, they might say they're busy with work (on a holiday!)." },
        ja: { quote: "一人で仕事、デートなし", interpretation: "デートなし、家で一人で一日中仕事。誰かを誘っても仕事で忙しいと言われるかも。" },
        ko: { quote: "혼자 일하고 데이트 없음", interpretation: "데이트 없이 집에서 혼자 하루 종일 일합니다." },
        "zh-CN": { quote: "一个人工作，没有约会", interpretation: "没有约会，只是在家一个人工作一整天。如果你约人出去，他们可能说工作忙（在假日！）。" },
        "zh-TW": { quote: "一個人工作，沒有約會", interpretation: "沒有約會，只是在家一個人工作一整天。" }
    },
    "NINE OF PENTACLES": {
        en: { quote: "Only dates in Thonglor, the ultimate diva", interpretation: "If you're going on a date, it has to be in a fancy area. Your makeup and outfit cost a fortune. You're successful and don't need anyone." },
        ja: { quote: "高級エリアでのデートのみ、究極のディーバ", interpretation: "デートするなら高級エリアで。メイクと服に大金がかかる。成功していて誰も必要ない。" },
        ko: { quote: "강남에서만 데이트, 궁극의 디바", interpretation: "데이트한다면 고급 지역에서. 메이크업과 옷에 많은 돈이 듭니다." },
        "zh-CN": { quote: "只在高档区约会，终极女王", interpretation: "如果你要约会，必须在高档区。你的妆容和服装花费不菲。你很成功，不需要任何人。" },
        "zh-TW": { quote: "只在高檔區約會，終極女王", interpretation: "如果你要約會，必須在高檔區。你的妝容和服裝花費不菲。" }
    },
    "TEN OF PENTACLES": {
        en: { quote: "Beware of someone taken, family may not approve", interpretation: "Make sure to communicate clearly before any date. You might meet someone whose family already knows them. Beware of someone already married or in a relationship." },
        ja: { quote: "既婚者に注意、家族が承認しないかも", interpretation: "デート前にしっかりコミュニケーションを。既婚者や交際中の人に注意。" },
        ko: { quote: "이미 있는 사람 조심, 가족이 승인하지 않을 수 있음", interpretation: "데이트 전에 확실히 소통하세요. 이미 결혼했거나 연애 중인 사람을 조심하세요." },
        "zh-CN": { quote: "小心有主的人，家人可能不同意", interpretation: "约会前确保沟通清楚。你可能遇到家人已经认识的人。小心已婚或有对象的人。" },
        "zh-TW": { quote: "小心有主的人，家人可能不同意", interpretation: "約會前確保溝通清楚。小心已婚或有對象的人。" }
    }
};

// Get translated quote
function getCardQuote(card) {
    if (currentLang === 'th') {
        return card.quote;
    }
    const trans = cardInterpretations[card.name];
    if (trans && trans[currentLang] && trans[currentLang].quote) {
        return trans[currentLang].quote;
    }
    // Fallback to English if available, otherwise Thai
    if (trans && trans.en && trans.en.quote) {
        return trans.en.quote;
    }
    return card.quote;
}

// Get translated interpretation
function getCardInterpretation(card) {
    if (currentLang === 'th') {
        return card.interpretation;
    }
    const trans = cardInterpretations[card.name];
    if (trans && trans[currentLang] && trans[currentLang].interpretation) {
        return trans[currentLang].interpretation;
    }
    // Fallback to English if available, otherwise Thai
    if (trans && trans.en && trans.en.interpretation) {
        return trans.en.interpretation;
    }
    return card.interpretation;
}

// Get translation by key path (e.g., "landing.instruction")
function t(key) {
    const keys = key.split('.');
    let value = translations[currentLang];
    for (const k of keys) {
        if (value && value[k] !== undefined) {
            value = value[k];
        } else {
            // Fallback to Thai
            value = translations['th'];
            for (const fk of keys) {
                if (value && value[fk] !== undefined) {
                    value = value[fk];
                } else {
                    return key;
                }
            }
            return value;
        }
    }
    return value;
}

// Apply translations to all elements with data-i18n attribute
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translated = t(key);
        if (translated && translated !== key) {
            el.textContent = translated;
        }
    });

    // Handle placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const translated = t(key);
        if (translated && translated !== key) {
            el.placeholder = translated;
        }
    });

    // Handle title attributes (tooltips)
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        const translated = t(key);
        if (translated && translated !== key) {
            el.title = translated;
        }
    });
}

// Set language and save to localStorage
function setLanguage(lang) {
    if (!translations[lang]) return;

    currentLang = lang;
    localStorage.setItem('tarot-lang', lang);

    // Update HTML lang attribute
    document.documentElement.lang = lang === 'zh-CN' ? 'zh-Hans' : lang === 'zh-TW' ? 'zh-Hant' : lang;

    // Apply translations
    applyTranslations();

    // Update language button display
    updateLangButton();

    // Update dynamic content that's already displayed
    refreshDynamicContent();
}

// Refresh dynamic content when language changes
function refreshDynamicContent() {
    // Update result panel if visible and has card data
    if (currentCardData) {
        const resultCardName = document.getElementById('resultCardName');
        const resultQuote = document.getElementById('resultQuote');
        const resultInterpretation = document.getElementById('resultInterpretation');

        if (resultCardName) {
            resultCardName.textContent = getCardName(currentCardData.name);
        }
        if (resultQuote) {
            resultQuote.textContent = `"${getCardQuote(currentCardData)}"`;
        }
        if (resultInterpretation) {
            resultInterpretation.textContent = getCardInterpretation(currentCardData);
        }

        // Re-check card comments to update button text
        checkCardComments(currentCardData.id);
    }

    // Refresh comments section dividers if on mycard tab
    if (currentCommentsTab === 'mycard') {
        loadMyCardComments();
    }

    // Refresh My Card tab text if visible
    const myCardTab = document.querySelector('[data-tab="mycard"]');
    if (myCardTab && myCardTab.style.display !== 'none') {
        myCardTab.textContent = t('comments.tabMyCard');
    }
}

// Update the language button to show current language
function updateLangButton() {
    const langBtn = document.getElementById('langBtn');
    if (!langBtn) return;

    const flags = {
        'th': '🇹🇭',
        'en': '🇬🇧',
        'zh-CN': '🇨🇳',
        'zh-TW': '🇹🇼',
        'ko': '🇰🇷',
        'ja': '🇯🇵'
    };

    const codes = {
        'th': 'TH',
        'en': 'EN',
        'zh-CN': '简',
        'zh-TW': '繁',
        'ko': 'KO',
        'ja': 'JA'
    };

    const flagEl = langBtn.querySelector('.lang-flag');
    const codeEl = langBtn.querySelector('.lang-code');

    if (flagEl) flagEl.textContent = flags[currentLang] || '🇹🇭';
    if (codeEl) codeEl.textContent = codes[currentLang] || 'TH';

    // Update active state in dropdown
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.lang === currentLang);
    });
}

// Initialize language switcher
function initLanguageSwitcher() {
    const langSwitcher = document.getElementById('langSwitcher');
    const langBtn = document.getElementById('langBtn');

    if (!langSwitcher || !langBtn) return;

    // Load saved language
    const savedLang = localStorage.getItem('tarot-lang');
    if (savedLang && translations[savedLang]) {
        currentLang = savedLang;
    }

    // Toggle dropdown
    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langSwitcher.classList.toggle('open');
    });

    // Handle language selection
    document.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.dataset.lang;
            setLanguage(lang);
            langSwitcher.classList.remove('open');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        langSwitcher.classList.remove('open');
    });

    // Initial setup
    updateLangButton();
    applyTranslations();
}

// ========================================
// Background Music Control
// ========================================
let isMuted = false;
let musicStarted = false;
let audioElement = null;

// ========================================
// Sound Effects
// ========================================
const soundEffects = {
    cardFlip: null,
    cardSpread: null,
    cardSelect: null
};

// Web Audio API context for amplification
let audioContext = null;

// Initialize sound effects
function initSoundEffects() {
    soundEffects.cardFlip = new Audio('audio/card_select.mp3');
    soundEffects.cardFlip.volume = 0.18;

    soundEffects.cardSpread = new Audio('audio/card_spread.mp3');
    soundEffects.cardSpread.volume = 1.0;
    soundEffects.cardSpread.gainBoost = 2.5; // Amplify 250%

    soundEffects.cardSelect = new Audio('audio/card_select.mp3');
    soundEffects.cardSelect.volume = 0.18;
}

// Play a sound effect with optional gain boost
function playSoundEffect(soundName) {
    if (isMuted) return;

    const sound = soundEffects[soundName];
    if (sound) {
        // If sound has gain boost, use Web Audio API
        if (sound.gainBoost && sound.gainBoost > 1) {
            playWithGainBoost(sound, sound.gainBoost);
        } else {
            sound.currentTime = 0;
            sound.play().catch(err => {
                console.log('Sound effect play failed:', err.message);
            });
        }
    }
}

// Play audio with amplification using Web Audio API
function playWithGainBoost(audioElement, gainValue) {
    try {
        // Create audio context if not exists
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        // Resume context if suspended
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        // Clone the audio to allow overlapping plays
        const tempAudio = new Audio(audioElement.src);

        // Create media element source
        const source = audioContext.createMediaElementSource(tempAudio);

        // Create gain node for amplification
        const gainNode = audioContext.createGain();
        gainNode.gain.value = gainValue;

        // Connect: source -> gain -> destination
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Play
        tempAudio.play().catch(err => {
            console.log('Amplified sound play failed:', err.message);
        });
    } catch (err) {
        // Fallback to normal playback
        console.log('Web Audio API failed, using fallback:', err.message);
        audioElement.currentTime = 0;
        audioElement.play().catch(e => console.log('Fallback play failed:', e.message));
    }
}

// Initialize sound effects on load
initSoundEffects();

// Initialize audio element
function initAudioElement() {
    if (audioElement) return audioElement;

    audioElement = document.getElementById('bgMusic');
    if (audioElement) {
        // Set source directly on element for better compatibility
        audioElement.src = 'audio/background.mp3';
        audioElement.volume = 0.15;
        audioElement.loop = true;
        audioElement.load();
        console.log('Audio element initialized');
    }
    return audioElement;
}

// Update sound indicator visibility
function updateSoundIndicator(isPlaying) {
    const indicator = document.getElementById('soundIndicator');
    if (indicator) {
        if (isPlaying && !isMuted) {
            indicator.classList.add('playing');
        } else {
            indicator.classList.remove('playing');
        }
    }
}

// Try to play music - must be called from user interaction
function tryPlayMusic(muteOnFail = false) {
    const audio = initAudioElement();
    if (!audio) {
        console.log('Audio element not found');
        return;
    }

    if (musicStarted && !audio.paused) {
        console.log('Music already playing');
        updateSoundIndicator(true);
        return;
    }

    audio.volume = 0.15;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            musicStarted = true;
            console.log('Music started playing successfully');
            updateSoundIndicator(true);
        }).catch(err => {
            console.log('Audio play failed:', err.message);
            musicStarted = false;
            updateSoundIndicator(false);
            // If autoplay fails on initial load, mute the audio
            if (muteOnFail) {
                isMuted = true;
                audio.muted = true;
                const muteIconEl = document.getElementById('muteIcon');
                const unmuteIconEl = document.getElementById('unmuteIcon');
                if (muteIconEl && unmuteIconEl) {
                    muteIconEl.style.display = 'none';
                    unmuteIconEl.style.display = 'block';
                }
                console.log('Autoplay blocked - audio muted by default');
            }
        });
    }
}

// Toggle mute/unmute
function toggleMute(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    const audio = initAudioElement();
    const muteIconEl = document.getElementById('muteIcon');
    const unmuteIconEl = document.getElementById('unmuteIcon');

    if (!audio) {
        console.log('Audio element not found');
        return;
    }

    isMuted = !isMuted;
    audio.muted = isMuted;

    // Track music toggle
    if (window.cardCounter) {
        window.cardCounter.trackMusicToggle(isMuted);
    }

    console.log('Mute toggled:', isMuted);

    if (muteIconEl && unmuteIconEl) {
        if (isMuted) {
            muteIconEl.style.display = 'none';
            unmuteIconEl.style.display = 'block';
            updateSoundIndicator(false);
        } else {
            muteIconEl.style.display = 'block';
            unmuteIconEl.style.display = 'none';
            // Try to play if paused
            if (audio.paused) {
                audio.play().then(() => {
                    musicStarted = true;
                    console.log('Music resumed');
                    updateSoundIndicator(true);
                }).catch(() => {
                    updateSoundIndicator(false);
                });
            } else {
                updateSoundIndicator(true);
            }
        }
    }
}

// Preload an image and return a promise
function preloadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => resolve(src); // Don't fail on error, just continue
        img.src = src;
    });
}

// Mark page as ready and enable card clicking with epic reveal
function markPageReady() {
    isPageReady = true;

    // Try to play background music (may be blocked by browser)
    // Show prompt if autoplay fails
    tryPlayMusic(true);

    // Reveal the header with epic animation
    const header = document.querySelector('.landing-heading');
    if (header) {
        header.classList.add('revealed');
    }

    // Add glow effect to card
    const cardContainer = document.getElementById('spinningCardContainer');
    if (cardContainer) {
        cardContainer.classList.add('ready-glow');
    }

    // Update hint text with ready animation (after header animation)
    setTimeout(() => {
        const hintText = document.querySelector('.card-click-hint');
        if (hintText) {
            hintText.textContent = t('landing.clickToDraw');
            hintText.setAttribute('data-i18n', 'landing.clickToDraw');
            hintText.classList.remove('loading-state');
            hintText.classList.add('ready-state');
        }

        // Reveal brand at bottom
        const brand = document.querySelector('.landing-brand');
        if (brand) {
            brand.classList.add('revealed');
        }

    }, 600);
}

// Wait for all resources to load
async function waitForResources() {
    // Start the card rotation animation immediately
    startCardRotation();
    createFloatingSparkles();

    // Load tarot data and essential images in parallel
    const essentialImages = [
        'images/card_back_red.png',
        ...spinningCardImages.slice(0, 3) // Only first 3 spinning images
    ];

    // Load data and essential images simultaneously
    await Promise.all([
        // Load tarot data
        (async () => {
            if (!tarotData) {
                try {
                    const response = await fetch('valentine_tarot.json');
                    tarotData = await response.json();
                } catch (error) {
                    console.error('Error loading tarot data:', error);
                }
            }
        })(),
        // Preload essential images only
        ...essentialImages.map(src => preloadImage(src))
    ]);

    // Render cards (they use card back image which is already loaded)
    renderCards();

    // Mark page as ready immediately - don't wait for all images
    markPageReady();

    // Load remaining images in background (non-blocking)
    loadRemainingImagesInBackground();
}

// Load remaining images in background after page is interactive
function loadRemainingImagesInBackground() {
    // Remaining spinning card images
    const remainingSpinning = spinningCardImages.slice(3);

    // All tarot card front images
    const tarotImages = (tarotData && tarotData.cards)
        ? tarotData.cards.map(card => `images/tarot/${card.image}`)
        : [];

    // Load in small batches to not block the main thread
    const allImages = [...remainingSpinning, ...tarotImages];
    let index = 0;
    const batchSize = 5;

    function loadBatch() {
        const batch = allImages.slice(index, index + batchSize);
        if (batch.length === 0) return;

        batch.forEach(src => {
            const img = new Image();
            img.src = src;
        });

        index += batchSize;
        // Load next batch after a short delay
        if (index < allImages.length) {
            setTimeout(loadBatch, 100);
        }
    }

    // Start loading after a small delay to let the page settle
    setTimeout(loadBatch, 500);
}

// Card images for spinning display
const spinningCardImages = [
    'images/tarot/THE LOVERS.png',
    'images/tarot/THE STAR.png',
    'images/tarot/THE SUN.png',
    'images/tarot/THE MOON.png',
    'images/tarot/THE EMPRESS.png',
    'images/tarot/THE EMPEROR.png',
    'images/tarot/WHEEL OF FORTUNE.png',
    'images/tarot/THE MAGICIAN.png',
    'images/tarot/THE HIGH PRIESTRESS.png',
    'images/tarot/STRENGTH.png'
];

let currentSpinningCardIndex = 0;
let spinningCardInterval = null;

// Change the front card image during rotation
function startCardRotation() {
    const frontImg = document.getElementById('spinningCardFront');

    // Wait 1.5s (when back is facing) then change image every 3s (full rotation)
    // This ensures image changes when back is facing, not when front is visible
    setTimeout(() => {
        // First change at 1.5s (back facing)
        currentSpinningCardIndex = (currentSpinningCardIndex + 1) % spinningCardImages.length;
        frontImg.src = spinningCardImages[currentSpinningCardIndex];

        // Then change every 3s (one full rotation, always when back is facing)
        spinningCardInterval = setInterval(() => {
            currentSpinningCardIndex = (currentSpinningCardIndex + 1) % spinningCardImages.length;
            frontImg.src = spinningCardImages[currentSpinningCardIndex];
        }, 3000);
    }, 1500);
}

// Create floating sparkles around spinning card
let sparkleInterval = null;
function createFloatingSparkles() {
    const container = document.getElementById('spinningCardContainer');

    sparkleInterval = setInterval(() => {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-particle';

        // Random position in a circle around the center
        const angle = Math.random() * Math.PI * 2;
        const radius = 100 + Math.random() * 60;
        const x = 90 + Math.cos(angle) * radius;
        const y = 160 + Math.sin(angle) * radius;

        // Random movement direction
        const moveX = (Math.random() - 0.5) * 40;
        const moveY = -20 - Math.random() * 30; // Float upward
        const duration = 1.5 + Math.random() * 1;
        const size = 3 + Math.random() * 5;

        sparkle.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            animation: sparkleRise ${duration}s ease-out forwards;
            --move-x: ${moveX}px;
            --move-y: ${moveY}px;
        `;

        container.appendChild(sparkle);

        // Remove after animation
        setTimeout(() => sparkle.remove(), duration * 1000);
    }, 200);
}

function stopFloatingSparkles() {
    if (sparkleInterval) {
        clearInterval(sparkleInterval);
        sparkleInterval = null;
    }
}

// Create sparkles for card burst effect
function createBurstSparkles(centerX, centerY) {
    const container = document.getElementById('cardBurstContainer');

    for (let i = 0; i < 25; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';

        const angle = Math.random() * Math.PI * 2;
        const distance = 150 + Math.random() * 250;
        const sx = Math.cos(angle) * distance;
        const sy = Math.sin(angle) * distance - 100;

        sparkle.style.cssText = `
            left: ${centerX}px;
            top: ${centerY}px;
            --sx: ${sx}px;
            --sy: ${sy}px;
            animation-delay: ${Math.random() * 300}ms;
            width: ${4 + Math.random() * 8}px;
            height: ${4 + Math.random() * 8}px;
        `;

        container.appendChild(sparkle);

        setTimeout(() => {
            sparkle.classList.add('animate');
        }, Math.random() * 300);
    }
}

// Create flying cards burst effect
function createCardBurst() {
    const container = document.getElementById('cardBurstContainer');
    const flashOverlay = document.getElementById('flashOverlay');
    const cardRect = document.getElementById('spinningCardContainer').getBoundingClientRect();
    const centerX = cardRect.left + cardRect.width / 2;
    const centerY = cardRect.top + cardRect.height / 2;

    // Trigger flash effect
    flashOverlay.classList.add('active');
    setTimeout(() => {
        flashOverlay.classList.remove('active');
    }, 600);

    // Create sparkles
    createBurstSparkles(centerX, centerY);

    // Create 14 flying cards
    for (let i = 0; i < 14; i++) {
        const card = document.createElement('div');
        card.className = 'flying-card';

        // Alternate between card back and front
        const imgSrc = i % 2 === 0 ? 'images/card_back_red.png' : spinningCardImages[i % spinningCardImages.length];
        card.innerHTML = `<img src="${imgSrc}" alt="Flying Card">`;

        // Random direction for burst effect
        const angle = (i / 14) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const distance = 180 + Math.random() * 120;
        const endDistance = 500 + Math.random() * 350;

        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        const txEnd = Math.cos(angle) * endDistance;
        const tyEnd = Math.sin(angle) * endDistance - 200;
        const rot = (Math.random() - 0.5) * 60;
        const rotEnd = rot + (Math.random() - 0.5) * 180;

        card.style.cssText = `
            left: ${centerX}px;
            top: ${centerY}px;
            --tx: ${tx}px;
            --ty: ${ty}px;
            --tx-end: ${txEnd}px;
            --ty-end: ${tyEnd}px;
            --rot: ${rot}deg;
            --rot-end: ${rotEnd}deg;
            animation-delay: ${i * 40}ms;
        `;

        container.appendChild(card);

        setTimeout(() => {
            card.classList.add('animate');
        }, 10 + i * 40);
    }

    // Clean up after animation
    setTimeout(() => {
        container.innerHTML = '';
    }, 2000);
}

// Start the experience (when card is clicked)
function startExperience() {
    // Don't allow starting if page is not ready yet
    if (!isPageReady) {
        return;
    }

    // Track journey step: landing to main
    if (window.cardCounter) {
        window.cardCounter.trackJourneyStep('landing');
        window.cardCounter.trackDeviceType();
    }

    // Play music on first user interaction (guaranteed to work)
    tryPlayMusic();

    // Play card select sound effect (magic sparkle)
    playSoundEffect('cardSelect');

    const spinningCard = document.getElementById('spinningCard');
    const spinningCardContainer = document.getElementById('spinningCardContainer');
    const spinningCardWrapper = spinningCardContainer.querySelector('.spinning-card-wrapper');
    const landingPage = document.getElementById('landingPage');
    const mainPage = document.getElementById('mainPage');
    const landingHeading = document.querySelector('.landing-heading');
    const cardGrid = document.getElementById('cardGrid');

    // Get stack card size for target shrink
    const { cardWidth, cardHeight } = getEllipseParams();

    // Stop the rotation interval and sparkles
    if (spinningCardInterval) {
        clearInterval(spinningCardInterval);
    }
    stopFloatingSparkles();

    // Step 1: Stop spinning and show back of card with smooth transition
    spinningCardWrapper.style.transition = 'transform 0.5s ease-out';
    spinningCardWrapper.style.animation = 'none';
    spinningCardWrapper.style.transform = 'rotateY(180deg)';

    // Step 2: Straighten the card (remove tilt)
    spinningCard.style.transition = 'transform 0.5s ease-out';
    spinningCard.style.transform = 'rotate(0deg)';

    // Hide hint text
    spinningCardContainer.querySelector('.card-click-hint').style.opacity = '0';

    // Fade out the original header smoothly
    // First, freeze current state by removing animation and setting explicit values
    landingHeading.style.animation = 'none';
    landingHeading.style.opacity = '1';
    landingHeading.style.transform = 'translateY(0) scale(1)';
    landingHeading.style.transition = 'opacity 0.6s ease';
    // Then fade out in next frame
    requestAnimationFrame(() => {
        landingHeading.style.opacity = '0';
    });

    // Hide other landing elements
    setTimeout(() => {
        document.querySelector('.landing-brand').style.opacity = '0';
        document.querySelector('.landing-instruction').style.opacity = '0';
    }, 200);

    // Prepare main page and card grid (hidden behind spinning card)
    setTimeout(() => {
        landingPage.style.pointerEvents = 'none';
        cardGrid.classList.add('stacked');
        // Don't add initial-hidden - cards will be behind the spinning card
        mainPage.classList.add('visible');
    }, 400);

    // Step 3: Shrink the card and move to stack center
    setTimeout(() => {
        // Calculate scale to match stack card size
        const currentWidth = spinningCardContainer.offsetWidth;
        const scale = cardWidth / currentWidth;

        // Clear the ready-glow animation first so transform can work
        spinningCardContainer.style.animation = 'none';
        spinningCardContainer.style.filter = 'none';

        // Calculate position difference to align with stack center
        const spinningRect = spinningCardContainer.getBoundingClientRect();
        const gridRect = cardGrid.getBoundingClientRect();

        // Calculate center of both elements
        const spinningCenterY = spinningRect.top + spinningRect.height / 2;
        const gridCenterY = gridRect.top + gridRect.height / 2;

        // Calculate how much to move
        const moveY = gridCenterY - spinningCenterY;

        // Apply shrink transition and transform with translate
        spinningCardContainer.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        requestAnimationFrame(() => {
            spinningCardContainer.style.transform = `translateY(${moveY}px) scale(${scale})`;
        });

        // Also reduce shadow on the card face
        const cardFaces = spinningCardContainer.querySelectorAll('.spinning-card-face');
        cardFaces.forEach(face => {
            face.style.transition = 'box-shadow 0.6s ease';
            face.style.boxShadow = '0 2px 8px rgba(114, 47, 55, 0.15)';
        });
    }, 500);

    // Step 4: After shrink completes, hide spinning card instantly and spread the stack
    setTimeout(() => {
        // Hide spinning card instantly with NO transition - it should just disappear
        // The stack is already visible behind at the same position
        spinningCardContainer.style.transition = 'none';
        spinningCardContainer.style.opacity = '0';
        spinningCardContainer.style.visibility = 'hidden';

        // Small delay before spreading to make it feel like the top card is part of the stack
        setTimeout(() => {
            cardGrid.classList.remove('stacked');
            animateToEllipse();

            // Create mini header that fades in at center of ellipse after cards spread
            // 78 cards * 15ms stagger + 600ms animation = ~1800ms total
            setTimeout(() => {
                const miniHeader = document.createElement('div');
                miniHeader.className = 'mini-header';
                miniHeader.innerHTML = 'Who\'s Gonna Be<br>My Next <span class="strikethrough-word"><span class="mistake">Mistake?</span><span class="valentine">Valentine!</span></span>';
                document.body.appendChild(miniHeader);

                // Fade in after a brief moment
                requestAnimationFrame(() => {
                    miniHeader.classList.add('visible');
                });
            }, 1800);
        }, 50);

        // Hide landing page
        setTimeout(() => {
            landingPage.classList.add('hidden');
            // Hide comments button on card spread
            updateCommentsBtnVisibility();
        }, 300);
    }, 1100);
}

// Load tarot data
async function loadTarotData() {
    try {
        const response = await fetch('valentine_tarot.json');
        tarotData = await response.json();
        renderCards();
    } catch (error) {
        console.error('Error loading tarot data:', error);
        document.getElementById('cardGrid').innerHTML =
            '<p class="loading">' + t('error.cardLoadFailed') + '</p>';
    }
}

// Shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Expand cards to 78 (or use all if already 78)
function expandCardsTo78(cards) {
    const targetCount = 78;
    const baseCount = cards.length; // 78 cards total (full tarot deck)
    const timesEach = Math.floor(targetCount / baseCount); // 1 (each card appears once)
    const remainder = targetCount % baseCount; // 0 (no duplicates needed)

    let expanded = [];

    // Add each card 'timesEach' times (3 times each = 66 cards)
    for (let i = 0; i < timesEach; i++) {
        expanded = expanded.concat(cards);
    }

    // Add 'remainder' more cards randomly (12 more to reach 78)
    const shuffledForExtra = shuffleArray([...cards]);
    for (let i = 0; i < remainder; i++) {
        expanded.push(shuffledForExtra[i]);
    }

    return expanded;
}

// Render cards
function renderCards() {
    const cardGrid = document.getElementById('cardGrid');
    const expandedCards = expandCardsTo78(tarotData.cards);
    const shuffledCards = shuffleArray(expandedCards);

    cardGrid.innerHTML = shuffledCards.map((card, index) => `
        <div class="card-container" data-card-id="${card.id}">
            <div class="card">
                <div class="card-face card-back">
                    <img src="images/card_back_red.png" alt="Card Back">
                </div>
                <div class="card-face card-front">
                    <img src="images/tarot/${card.image}" alt="${card.name}">
                </div>
            </div>
        </div>
    `).join('');

    // Add click listeners and hover effects
    document.querySelectorAll('.card-container').forEach((container, index) => {
        container.addEventListener('click', () => {
            const cardId = parseInt(container.dataset.cardId);
            selectCard(cardId, container);
        });

        // Store original transform for hover effects
        container.dataset.index = index;

        // No hover effects - card stays at original size and z-index
    });

    // Apply stacked layout initially (animation triggered later)
    applyStackedLayout();
}

// Apply stacked layout (initial state)
function applyStackedLayout() {
    const containers = document.querySelectorAll('.card-container');
    const { cardWidth, cardHeight } = getEllipseParams();

    containers.forEach((container, index) => {
        // Small random offset for natural stack look
        const offsetX = (Math.random() - 0.5) * 6;
        const offsetY = (Math.random() - 0.5) * 3;
        const rotation = (Math.random() - 0.5) * 8;

        container.classList.add('stacked');
        container.classList.remove('spread');
        container.style.width = `${cardWidth}px`;
        container.style.height = `${cardHeight}px`;
        container.style.left = `calc(50% - ${cardWidth/2}px + ${offsetX}px)`;
        container.style.top = `calc(50% - ${cardHeight/2}px + ${offsetY}px)`;
        container.style.transform = `rotate(${rotation}deg)`;
        container.style.zIndex = index;
        container.style.transition = 'none';
    });
}

// Animate cards from stack to ellipse
function animateToEllipse() {
    // Play card spread sound effect
    playSoundEffect('cardSpread');

    const containers = document.querySelectorAll('.card-container');
    const totalCards = containers.length;
    const { radiusX, radiusY, cardWidth, cardHeight, offsetY } = getEllipseParams();

    containers.forEach((container, index) => {
        // Stagger the animation
        const delay = index * 15;

        setTimeout(() => {
            container.classList.remove('stacked');
            container.classList.add('spread');
            container.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';

            const anglePerCard = (2 * Math.PI) / totalCards;
            const angle = index * anglePerCard - Math.PI / 2;

            const x = radiusX * Math.cos(angle);
            const y = radiusY * Math.sin(angle) + offsetY;
            const rotationDeg = (angle * 180 / Math.PI) + 90;

            container.style.left = `calc(50% + ${x}px - ${cardWidth/2}px)`;
            container.style.top = `calc(50% + ${y}px - ${cardHeight/2}px)`;
            container.style.transform = `rotate(${rotationDeg}deg)`;
            container.style.zIndex = index;

            // Reset transition and add floating animation after spread completes
            setTimeout(() => {
                // Set up CSS variables for animation
                container.style.setProperty('--card-rotation', `rotate(${rotationDeg}deg)`);
                container.style.setProperty('--float-delay', `${(index % 10) * 0.3}s`);
                // Clear inline transform and add floating class in same frame
                container.style.transition = 'none';
                container.style.transform = '';
                requestAnimationFrame(() => {
                    container.classList.add('floating');
                });
            }, 600);
        }, delay);
    });
}

// Get responsive elliptical parameters
function getEllipseParams() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    // Account for footer height
    const availableHeight = height - 50;
    if (width <= 480) {
        // Mobile: tall ellipse along screen height
        return {
            radiusX: Math.min(width * 0.36, 140),   // Narrow horizontal
            radiusY: Math.min(availableHeight * 0.30, 200),  // Tall vertical, fit within screen
            cardWidth: 40,
            cardHeight: 71,
            offsetY: 0
        };
    } else if (width <= 768) {
        return {
            radiusX: 150,   // Narrow
            radiusY: Math.min(availableHeight * 0.35, 260),   // Fit within screen
            cardWidth: 50,
            cardHeight: 89,
            offsetY: 0
        };
    }
    return {
        radiusX: 180,   // Narrow
        radiusY: Math.min(availableHeight * 0.38, 340),   // Fit within screen
        cardWidth: 65,
        cardHeight: 116,
        offsetY: 0
    };
}

// Get card transform based on index for elliptical layout
function getCardTransform(index) {
    const totalCards = 78;
    const anglePerCard = (2 * Math.PI) / totalCards;
    const angle = index * anglePerCard - Math.PI / 2; // Start from top
    const rotationDeg = (angle * 180 / Math.PI) + 90; // Point outward
    return `rotate(${rotationDeg}deg)`;
}

// Apply elliptical layout
function applyCircularLayout() {
    const containers = document.querySelectorAll('.card-container');
    const totalCards = containers.length;
    const { radiusX, radiusY, cardWidth, cardHeight, offsetY } = getEllipseParams();

    containers.forEach((container, index) => {
        const anglePerCard = (2 * Math.PI) / totalCards;
        const angle = index * anglePerCard - Math.PI / 2; // Start from top

        // Calculate position on ellipse
        const x = radiusX * Math.cos(angle);
        const y = radiusY * Math.sin(angle) + offsetY;

        // Rotation to point outward from center
        const rotationDeg = (angle * 180 / Math.PI) + 90;

        container.style.width = `${cardWidth}px`;
        container.style.height = `${cardHeight}px`;
        container.style.left = `calc(50% + ${x}px - ${cardWidth/2}px)`;
        container.style.top = `calc(50% + ${y}px - ${cardHeight/2}px)`;
        container.style.transformOrigin = 'center center';
        container.style.transform = `rotate(${rotationDeg}deg)`;
        container.style.zIndex = index;
    });
}

// Create sparkle particles for card selection
function createSparkles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 12; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';

        // Random angle for each sparkle
        const angle = (i / 12) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const distance = 60 + Math.random() * 40;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        sparkle.style.left = `${centerX}px`;
        sparkle.style.top = `${centerY}px`;
        sparkle.style.setProperty('--sparkle-x', `${x}px`);
        sparkle.style.setProperty('--sparkle-y', `${y}px`);
        sparkle.style.animationDelay = `${Math.random() * 0.2}s`;
        sparkle.style.width = `${6 + Math.random() * 6}px`;
        sparkle.style.height = sparkle.style.width;

        document.body.appendChild(sparkle);

        // Remove sparkle after animation
        setTimeout(() => sparkle.remove(), 1000);
    }
}

// Select card
function selectCard(cardId, cardElement) {
    if (isAnimating) return;
    isAnimating = true;

    const card = tarotData.cards.find(c => c.id === cardId);
    if (!card) {
        isAnimating = false;
        return;
    }

    selectedCardElement = cardElement;

    // Play card flip sound effect when picking a card
    playSoundEffect('cardFlip');

    // Reset hover scale immediately to prevent visual jump
    const index = parseInt(cardElement.dataset.index);
    const originalTransform = getCardTransform(index);
    cardElement.style.transition = 'none';
    cardElement.style.transform = originalTransform;
    // Force reflow to apply the change immediately
    cardElement.offsetHeight;

    // Set center card image
    document.getElementById('centerCardImage').src = `images/tarot/${card.image}`;

    // Reset center card flip state
    document.getElementById('centerCardInner').classList.remove('flipped');

    // Get current rotation from CSS variable or computed style
    const currentRotation = cardElement.style.getPropertyValue('--card-rotation') ||
                           cardElement.style.transform || 'rotate(0deg)';
    const rotationMatch = currentRotation.match(/rotate\(([-\d.]+)deg\)/);
    const rotationDeg = rotationMatch ? parseFloat(rotationMatch[1]) : 0;

    // Track card pick journey and timing
    if (window.cardCounter) {
        window.cardCounter.trackJourneyStep('pick');
        window.cardCounter.trackTimeToFirstPick();
        // Track card position (convert rotation to angle on circle)
        const cardAngle = (rotationDeg - 90 + 360) % 360;
        window.cardCounter.trackCardPosition(cardAngle);
    }

    // Step 1: Add selecting class for golden glow
    cardElement.classList.add('selecting');

    // Create sparkle particles
    createSparkles(cardElement);

    // Calculate slide direction - move outward from ellipse center
    const slideDistance = 40;
    // The card's rotation is (angle + 90), so subtract 90 to get the radial angle
    const radialAngle = (rotationDeg - 90) * Math.PI / 180;
    // Slide outward along the radial direction (away from center)
    const slideX = Math.cos(radialAngle) * slideDistance;
    const slideY = Math.sin(radialAngle) * slideDistance;

    // Apply slide animation - card moves outward while keeping its rotation
    cardElement.style.transition = 'transform 0.4s ease-out, left 0.4s ease-out, top 0.4s ease-out';
    // Update position to slide outward
    const currentLeft = cardElement.style.left;
    const currentTop = cardElement.style.top;
    cardElement.style.left = `calc(${currentLeft} + ${slideX}px)`;
    cardElement.style.top = `calc(${currentTop} + ${slideY}px)`;

    // Disable other cards
    document.querySelectorAll('.card-container').forEach(c => {
        if (c !== cardElement) {
            c.classList.add('disabled');
        }
    });

    // Step 2: Fade out card and show overlay
    setTimeout(() => {
        cardElement.classList.add('slide-out');
    }, 300);

    // Step 3: Show overlay and center card slides down
    setTimeout(() => {
        document.getElementById('overlay').classList.add('active');
        document.getElementById('centerCard').classList.add('active');

        // Step 4: Flip center card
        setTimeout(() => {
            document.getElementById('centerCardInner').classList.add('flipped');

            // Step 5: Show result panel
            setTimeout(() => {
                currentCardData = card; // Store for save image
                document.getElementById('resultCardName').textContent = getCardName(card.name);
                document.getElementById('resultQuote').textContent = `"${getCardQuote(card)}"`;
                document.getElementById('resultInterpretation').textContent = getCardInterpretation(card);
                document.getElementById('resultPanel').classList.add('active');
                isAnimating = false;

                // Track card pick in Firebase
                if (window.cardCounter && window.cardCounter.increment) {
                    window.cardCounter.increment(card.id, card.name, getUserId());
                }

                // Track journey step: result
                if (window.cardCounter) {
                    window.cardCounter.trackJourneyStep('result');
                }

                // Check if this card has comments and update button visibility
                checkCardComments(card.id);

                // Show comments button now that result is visible
                updateCommentsBtnVisibility();
            }, 800);
        }, 500);
    }, 600);
}

// Close and reset
function closeResult() {
    if (isAnimating) return;
    isAnimating = true;

    // Track retry
    if (window.cardCounter) window.cardCounter.trackRetry();

    const cardGrid = document.getElementById('cardGrid');

    // Reset accept actions container and buttons
    const acceptActions = document.getElementById('acceptActions');
    const commentToggleBtn = document.getElementById('commentToggleBtn');
    const viewCommentsBtn = document.getElementById('viewCommentsBtn');
    if (acceptActions) acceptActions.style.display = 'none';
    if (commentToggleBtn) {
        commentToggleBtn.style.display = 'inline-flex';
        commentToggleBtn.classList.remove('active');
        commentToggleBtn.classList.remove('commented');
        commentToggleBtn.disabled = false;
        const btnText = commentToggleBtn.querySelector('span');
        if (btnText) btnText.textContent = t('result.acceptProphecy');
        // Restore original checkmark icon
        const svgIcon = commentToggleBtn.querySelector('svg');
        if (svgIcon) {
            svgIcon.innerHTML = '<path d="M20 6L9 17l-5-5"/>';
        }
    }
    // Reset view comments button
    if (viewCommentsBtn) {
        viewCommentsBtn.style.display = 'none';
    }
    if (typeof resetCommentForm === 'function') resetCommentForm();

    // Hide result panel
    document.getElementById('resultPanel').classList.remove('active');

    // Hide comments button when going back to card spread
    updateCommentsBtnVisibility();

    setTimeout(() => {
        // Hide center card
        document.getElementById('centerCard').classList.remove('active');

        // Hide overlay
        document.getElementById('overlay').classList.remove('active');

        // Reshuffle and re-render
        setTimeout(() => {
            cardGrid.classList.add('stacked');
            renderCards();
            selectedCardElement = null;
            isAnimating = false;

            // Animate cards from stack to fan
            setTimeout(() => {
                cardGrid.classList.remove('stacked');
                animateToEllipse();
            }, 100);
        }, 400);
    }, 300);
}

// Event listeners
document.getElementById('spinningCardContainer').addEventListener('click', startExperience);
document.getElementById('resultClose').addEventListener('click', closeResult);

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeResult();
    }
    if (e.key === 'Enter' || e.key === ' ') {
        const landingPage = document.getElementById('landingPage');
        if (!landingPage.classList.contains('hidden')) {
            startExperience();
        }
    }
});

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        applyCircularLayout();
    }, 100);
});

// Share Functions
const siteUrl = 'https://pimfahmaprod.github.io/love-tarot/';

function getShareText() {
    const cardName = document.getElementById('resultCardName').textContent;
    const quote = document.getElementById('resultQuote').textContent.replace(/[""]/g, '');
    return `${t('share.gotCard')} ${cardName}\n"${quote}"\n\n${t('share.letsRead')}`;
}

function showToast(message) {
    const toast = document.getElementById('copyToast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// Try Web Share API first (best for mobile)
function tryWebShare() {
    if (navigator.share) {
        navigator.share({
            title: t('share.title'),
            text: getShareText(),
            url: siteUrl
        }).catch(() => {});
        return true;
    }
    return false;
}

function shareToFacebook() {
    // Track share
    if (window.cardCounter) window.cardCounter.trackShare('messenger');

    // Share to Facebook Messenger
    const text = getShareText() + '\n\n' + siteUrl;
    navigator.clipboard.writeText(text).then(() => {
        showToast(t('share.copiedForMessenger'));
        setTimeout(() => {
            // Try Messenger deep link first (works on mobile), fallback to web
            const messengerUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(siteUrl)}&redirect_uri=${encodeURIComponent(siteUrl)}`;
            window.open(messengerUrl, '_blank', 'width=600,height=400');
        }, 500);
    });
}

function shareToLine() {
    // Track share
    if (window.cardCounter) window.cardCounter.trackShare('line');

    // LINE already opens chat/messaging
    const text = encodeURIComponent(getShareText() + '\n' + siteUrl);
    window.open(`https://line.me/R/share?text=${text}`, '_blank', 'width=600,height=400');
}

function copyLink() {
    // Track share
    if (window.cardCounter) window.cardCounter.trackShare('copylink');

    const text = getShareText() + '\n\n' + siteUrl;
    navigator.clipboard.writeText(text).then(() => {
        showToast(t('share.copiedText'));
    });
}

// Comment Functions
const SAVED_NAME_KEY = 'tarot_user_name';
const USER_ID_KEY = 'tarot_user_id';

function generateUserId() {
    return 'user_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
}

function getUserId() {
    let userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) {
        userId = generateUserId();
        localStorage.setItem(USER_ID_KEY, userId);
    }
    return userId;
}

function getSavedUserName() {
    return localStorage.getItem(SAVED_NAME_KEY) || '';
}

function saveUserName(name) {
    localStorage.setItem(SAVED_NAME_KEY, name.trim());
}

function toggleAcceptActions() {
    const acceptActions = document.getElementById('acceptActions');
    const btn = document.getElementById('commentToggleBtn');
    const nameGroup = document.getElementById('commentNameGroup');
    const savedName = getSavedUserName();

    // Show accept actions and hide the button
    acceptActions.style.display = 'block';
    btn.style.display = 'none';

    // Track accept action
    if (window.cardCounter) {
        window.cardCounter.trackCommentFormStart();
    }

    // Check if name is already saved
    if (savedName && nameGroup) {
        nameGroup.style.display = 'none';
    } else if (nameGroup) {
        nameGroup.style.display = 'block';
    }
}

// Legacy function alias
function toggleCommentForm() {
    toggleAcceptActions();
}

// Check if current card has comments and update button visibility
async function checkCardComments(cardId) {
    const viewCommentsBtn = document.getElementById('viewCommentsBtn');
    const commentToggleBtn = document.getElementById('commentToggleBtn');
    const commentToggleBtnText = document.getElementById('commentToggleBtnText');

    if (!viewCommentsBtn || !commentToggleBtn || !commentToggleBtnText) return;

    // Default state: hide view button, show normal text
    viewCommentsBtn.style.display = 'none';
    commentToggleBtnText.textContent = t('result.acceptProphecy');

    // Check if Firebase is available
    if (!window.cardCounter || !window.cardCounter.fetchCommentsByCardId) {
        return;
    }

    try {
        const comments = await window.cardCounter.fetchCommentsByCardId(cardId, null, 1);

        if (comments && comments.length > 0) {
            // Card has comments: show both buttons
            viewCommentsBtn.style.display = 'inline-flex';
            commentToggleBtnText.textContent = t('result.acceptProphecy');
        } else {
            // Card has no comments: hide view button, change text
            viewCommentsBtn.style.display = 'none';
            commentToggleBtnText.textContent = t('cta.acceptFirst');
        }
    } catch (error) {
        console.warn('Failed to check card comments:', error);
    }
}

// Store card data for cardview tab
let cardViewData = null;

// View comments for the current card (opens cardview tab)
async function viewCardComments() {
    if (!currentCardData) return;

    // Track view card comments (ส่อง button)
    if (window.cardCounter) {
        window.cardCounter.trackFeatureUsage('viewCardComments', 'click');
    }

    // Store card data for the cardview tab
    cardViewData = { ...currentCardData };

    // Open comments panel
    openCommentsPanel();

    // Switch to cardview tab
    setTimeout(() => {
        const commentsTabs = document.getElementById('commentsTabs');
        const cardviewTab = commentsTabs.querySelector('[data-tab="cardview"]');
        const tabPreview = cardviewTab.querySelector('.tab-card-preview');

        // Set the card image in tab
        tabPreview.src = `images/tarot/${cardViewData.image}`;
        tabPreview.alt = cardViewData.name;

        // Show and activate the cardview tab
        cardviewTab.style.display = '';

        // Update active tab
        commentsTabs.querySelectorAll('.comments-tab').forEach(t => t.classList.remove('active'));
        cardviewTab.classList.add('active');

        // Switch tab content
        currentCommentsTab = 'cardview';
        switchCommentsTab('cardview');
    }, 100);
}

function resetCommentForm() {
    const savedName = getSavedUserName();
    const nameInput = document.getElementById('commentName');
    const nameGroup = document.getElementById('commentNameGroup');

    if (!savedName && nameInput) {
        nameInput.value = '';
        document.getElementById('nameCharCount').textContent = '0';
    }
    if (nameGroup) {
        nameGroup.style.display = savedName ? 'none' : 'block';
    }

    document.getElementById('commentText').value = '';
    document.getElementById('commentCharCount').textContent = '0';
    document.getElementById('commentSubmitBtn').disabled = false;
    document.getElementById('commentSubmitBtn').classList.remove('success');
    document.getElementById('commentSubmitText').textContent = t('comment.submit');
}

// Character count listeners
document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('commentName');
    const commentInput = document.getElementById('commentText');

    if (nameInput) {
        nameInput.addEventListener('input', () => {
            document.getElementById('nameCharCount').textContent = nameInput.value.length;
        });
    }

    if (commentInput) {
        commentInput.addEventListener('input', () => {
            document.getElementById('commentCharCount').textContent = commentInput.value.length;
        });
    }

    // Track interpretation scroll depth
    const resultPanel = document.getElementById('resultPanel');
    if (resultPanel) {
        let maxScrollTracked = 0;
        resultPanel.addEventListener('scroll', () => {
            const scrollTop = resultPanel.scrollTop;
            const scrollHeight = resultPanel.scrollHeight - resultPanel.clientHeight;
            if (scrollHeight > 0) {
                const scrollPercent = Math.round((scrollTop / scrollHeight) * 100);
                // Only track when reaching new milestones (25%, 50%, 75%, 100%)
                const milestones = [25, 50, 75, 100];
                for (const milestone of milestones) {
                    if (scrollPercent >= milestone && maxScrollTracked < milestone) {
                        maxScrollTracked = milestone;
                        if (window.cardCounter) {
                            window.cardCounter.trackInterpretationScroll(milestone);
                        }
                    }
                }
            }
        });
        // Reset max scroll when panel closes (detected by class change)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class' && !resultPanel.classList.contains('active')) {
                    maxScrollTracked = 0;
                }
            });
        });
        observer.observe(resultPanel, { attributes: true });
    }
});

async function submitComment() {
    const nameInput = document.getElementById('commentName');
    const commentInput = document.getElementById('commentText');
    const submitBtn = document.getElementById('commentSubmitBtn');
    const submitText = document.getElementById('commentSubmitText');

    // Use saved name or input value, default to "Anonymous"
    const savedName = getSavedUserName();
    const userName = savedName || nameInput.value.trim() || 'Anonymous';

    // Use input text or placeholder as default
    const defaultComment = t('comment.placeholder');
    const commentText = commentInput.value.trim() || defaultComment;

    if (!currentCardData) {
        showToast(t('toast.error'));
        return;
    }

    // Disable button and show loading
    submitBtn.disabled = true;
    submitText.textContent = t('comment.sending');

    // Submit to Firebase
    if (window.cardCounter && window.cardCounter.submitComment) {
        const userId = getUserId();
        const result = await window.cardCounter.submitComment(
            currentCardData.id,
            currentCardData.name,
            currentCardData.image,
            userId,
            userName,
            commentText
        );

        if (result.success) {
            // Track comment form submitted
            if (window.cardCounter) {
                window.cardCounter.trackCommentFormSubmit();
            }

            // Save name for future comments (only if not Anonymous)
            if (userName !== 'Anonymous') {
                saveUserName(userName);
            }

            // Show "ไพ่ฉัน" tab now that user has commented on their card
            checkMyCardTab();

            submitBtn.classList.add('success');
            submitText.textContent = t('toast.submitSuccess');

            // Show blessing celebration screen after short delay
            setTimeout(() => {
                showBlessingScreen(userName, commentText);
            }, 800);
        } else {
            submitBtn.disabled = false;
            submitText.textContent = t('comment.submit');
            showToast(t('toast.error'));
        }
    } else {
        submitBtn.disabled = false;
        submitText.textContent = t('comment.submit');
        showToast(t('toast.systemNotReady'));
    }
}

// ========================================
// Blessing Celebration Screen
// ========================================

let blessingSparkleInterval = null;

function showBlessingScreen(userName, comment) {
    const blessingScreen = document.getElementById('blessingScreen');
    const blessingCard = document.getElementById('blessingCard');
    const blessingName = document.getElementById('blessingName');
    const blessingComment = document.getElementById('blessingComment');

    if (!blessingScreen || !currentCardData) return;

    // Track blessing screen shown
    if (window.cardCounter) {
        window.cardCounter.trackFeatureUsage('blessingScreen', 'shown');
    }

    // Set card image
    blessingCard.src = `images/tarot/${currentCardData.image}`;

    // Set user name and comment
    blessingName.textContent = userName === 'Anonymous' ? '' : `— ${userName} —`;
    blessingComment.textContent = `"${comment}"`;

    // Hide other panels
    document.getElementById('resultPanel').classList.remove('active');
    document.getElementById('centerCard').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');

    // Show blessing screen
    blessingScreen.classList.add('active');

    // Start sparkle particles
    startBlessingSparkles();

    // Setup restart button
    const restartBtn = document.getElementById('blessingRestartBtn');
    if (restartBtn) {
        restartBtn.onclick = closeBlessingAndRestart;
    }
}

// Create floating sparkles for blessing card
function startBlessingSparkles() {
    const container = document.querySelector('.blessing-card-container');
    if (!container) return;

    // Clear any existing interval
    if (blessingSparkleInterval) {
        clearInterval(blessingSparkleInterval);
    }

    blessingSparkleInterval = setInterval(() => {
        const sparkle = document.createElement('div');
        sparkle.className = 'blessing-sparkle';

        // Random position around the card
        const angle = Math.random() * Math.PI * 2;
        const distance = 80 + Math.random() * 60;
        const startX = 100 + Math.cos(angle) * distance;
        const startY = 178 + Math.sin(angle) * distance;

        // Random movement direction
        const moveX = (Math.random() - 0.5) * 100;
        const moveY = -30 - Math.random() * 60;
        const duration = 1.5 + Math.random() * 1;

        sparkle.style.cssText = `
            left: ${startX}px;
            top: ${startY}px;
            --move-x: ${moveX}px;
            --move-y: ${moveY}px;
            animation: blessingSparkleRise ${duration}s ease-out forwards;
        `;

        container.appendChild(sparkle);

        // Remove after animation
        setTimeout(() => sparkle.remove(), duration * 1000);
    }, 150);
}

function stopBlessingSparkles() {
    if (blessingSparkleInterval) {
        clearInterval(blessingSparkleInterval);
        blessingSparkleInterval = null;
    }
    // Remove any remaining sparkles
    const container = document.querySelector('.blessing-card-container');
    if (container) {
        container.querySelectorAll('.blessing-sparkle').forEach(s => s.remove());
    }
}

function closeBlessingAndRestart() {
    const blessingScreen = document.getElementById('blessingScreen');

    // Stop sparkles
    stopBlessingSparkles();

    // Fade out blessing screen
    blessingScreen.style.animation = 'blessingFadeIn 0.5s ease reverse forwards';

    setTimeout(() => {
        blessingScreen.classList.remove('active');
        blessingScreen.style.animation = '';

        // Go back to landing page (not card selection)
        goToLandingPage();
    }, 500);
}

function goToLandingPage() {
    // Track restart to landing page
    if (window.cardCounter) {
        window.cardCounter.trackFeatureUsage('restart', 'toLanding');
    }

    const landingPage = document.getElementById('landingPage');
    const mainPage = document.getElementById('mainPage');
    const spinningCardContainer = document.getElementById('spinningCardContainer');
    const spinningCardWrapper = spinningCardContainer.querySelector('.spinning-card-wrapper');
    const spinningCard = document.getElementById('spinningCard');
    const landingHeading = document.querySelector('.landing-heading');
    const landingBrand = document.querySelector('.landing-brand');
    const landingInstruction = document.querySelector('.landing-instruction');
    const cardClickHint = spinningCardContainer.querySelector('.card-click-hint');
    const cardGrid = document.getElementById('cardGrid');
    const miniHeader = document.querySelector('.mini-header');

    // Reset accept actions and buttons
    const acceptActions = document.getElementById('acceptActions');
    const commentToggleBtn = document.getElementById('commentToggleBtn');
    const viewCommentsBtn = document.getElementById('viewCommentsBtn');
    if (acceptActions) acceptActions.style.display = 'none';
    if (commentToggleBtn) {
        commentToggleBtn.style.display = 'inline-flex';
        commentToggleBtn.classList.remove('active');
        commentToggleBtn.classList.remove('commented');
        commentToggleBtn.disabled = false;
        const btnText = commentToggleBtn.querySelector('span');
        if (btnText) btnText.textContent = t('result.acceptProphecy');
        const svgIcon = commentToggleBtn.querySelector('svg');
        if (svgIcon) {
            svgIcon.innerHTML = '<path d="M20 6L9 17l-5-5"/>';
        }
    }
    if (viewCommentsBtn) {
        viewCommentsBtn.style.display = 'none';
    }
    if (typeof resetCommentForm === 'function') resetCommentForm();

    // Step 1: Fade out main page smoothly
    mainPage.style.transition = 'opacity 0.4s ease';
    mainPage.style.opacity = '0';

    // Remove mini header with fade
    if (miniHeader) {
        miniHeader.style.transition = 'opacity 0.3s ease';
        miniHeader.style.opacity = '0';
        setTimeout(() => miniHeader.remove(), 300);
    }

    // Step 2: After fade out, prepare landing page
    setTimeout(() => {
        // Hide main page completely
        mainPage.classList.remove('visible');
        mainPage.style.opacity = '';
        mainPage.style.transition = '';

        // Reset all card containers - remove spread/floating classes
        const cardContainers = document.querySelectorAll('.card-container');
        cardContainers.forEach(container => {
            container.classList.remove('spread');
            container.classList.remove('floating');
            container.style.transition = 'none';
            container.style.transform = '';
            container.style.left = '';
            container.style.top = '';
        });

        // Re-render cards fresh (renderCards already shuffles)
        renderCards();

        // Reset card grid to stacked state
        cardGrid.classList.add('stacked');
        cardGrid.classList.remove('initial-hidden');

        // Reset spinning card container - start invisible for fade in
        spinningCardContainer.style.transition = 'none';
        spinningCardContainer.style.transform = '';
        spinningCardContainer.style.opacity = '0';
        spinningCardContainer.style.visibility = 'visible';
        spinningCardContainer.style.animation = '';
        spinningCardContainer.style.filter = '';

        // Reset card faces shadow
        const cardFaces = spinningCardContainer.querySelectorAll('.spinning-card-face');
        cardFaces.forEach(face => {
            face.style.transition = '';
            face.style.boxShadow = '';
        });

        // Reset spinning card wrapper - back to spinning animation
        spinningCardWrapper.style.transition = '';
        spinningCardWrapper.style.transform = '';
        spinningCardWrapper.style.animation = 'spinOnY 4s linear infinite';

        // Reset spinning card tilt
        spinningCard.style.transition = '';
        spinningCard.style.transform = 'rotate(-29.3deg)';

        // Show hint text
        if (cardClickHint) {
            cardClickHint.style.opacity = '1';
        }

        // Reset landing elements - start invisible
        landingHeading.style.animation = '';
        landingHeading.style.opacity = '0';
        landingHeading.style.transform = '';
        landingHeading.style.transition = '';

        if (landingBrand) {
            landingBrand.style.opacity = '0';
        }
        if (landingInstruction) {
            landingInstruction.style.opacity = '0';
        }

        // Show landing page
        landingPage.classList.remove('hidden');
        landingPage.style.pointerEvents = 'auto';

        // Show comments button on landing page
        updateCommentsBtnVisibility();

        // Scroll to top instantly
        window.scrollTo({ top: 0, behavior: 'instant' });

        // Step 3: Fade in landing elements smoothly
        requestAnimationFrame(() => {
            // Fade in spinning card
            spinningCardContainer.style.transition = 'opacity 0.5s ease';
            spinningCardContainer.style.opacity = '1';

            // Fade in heading
            landingHeading.style.transition = 'opacity 0.5s ease';
            landingHeading.style.opacity = '1';

            // Fade in other elements with slight delays
            setTimeout(() => {
                if (landingBrand) {
                    landingBrand.style.transition = 'opacity 0.4s ease';
                    landingBrand.style.opacity = '1';
                }
            }, 150);

            setTimeout(() => {
                if (landingInstruction) {
                    landingInstruction.style.transition = 'opacity 0.4s ease';
                    landingInstruction.style.opacity = '1';
                }
            }, 300);
        });

        // Restart spinning card interval and sparkles
        startCardRotation();
        createFloatingSparkles();

        // Reset state
        isPaused = false;
        currentCardData = null;

        // Track retry
        if (window.cardCounter) window.cardCounter.trackRetry();
    }, 400);
}

function resetForNewPick() {
    // Reset accept actions container and buttons
    const acceptActions = document.getElementById('acceptActions');
    const commentToggleBtn = document.getElementById('commentToggleBtn');
    const viewCommentsBtn = document.getElementById('viewCommentsBtn');
    if (acceptActions) acceptActions.style.display = 'none';
    if (commentToggleBtn) {
        commentToggleBtn.style.display = 'inline-flex';
        commentToggleBtn.classList.remove('active');
        commentToggleBtn.classList.remove('commented');
        commentToggleBtn.disabled = false;
        const btnText = commentToggleBtn.querySelector('span');
        if (btnText) btnText.textContent = t('result.acceptProphecy');
        const svgIcon = commentToggleBtn.querySelector('svg');
        if (svgIcon) {
            svgIcon.innerHTML = '<path d="M20 6L9 17l-5-5"/>';
        }
    }
    if (viewCommentsBtn) {
        viewCommentsBtn.style.display = 'none';
    }
    if (typeof resetCommentForm === 'function') resetCommentForm();

    // Track retry
    if (window.cardCounter) window.cardCounter.trackRetry();

    // Re-render cards (renderCards already shuffles)
    renderCards();

    // Reset state
    isPaused = false;
    currentCardData = null;

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================
// Comments Panel
// ========================================
let commentsLastKey = null;
let commentsHasMore = true;
let isLoadingComments = false;
let currentCommentsTab = 'new'; // 'new', 'hot', 'me'

function initCommentsPanel() {
    const commentsBtn = document.getElementById('commentsBtn');
    const commentsPanel = document.getElementById('commentsPanel');
    const commentsOverlay = document.getElementById('commentsOverlay');
    const commentsPanelClose = document.getElementById('commentsPanelClose');
    const commentsList = document.getElementById('commentsList');
    const commentsTabs = document.getElementById('commentsTabs');

    if (commentsBtn) {
        commentsBtn.addEventListener('click', openCommentsPanel);
    }

    if (commentsPanelClose) {
        commentsPanelClose.addEventListener('click', closeCommentsPanel);
    }

    if (commentsOverlay) {
        commentsOverlay.addEventListener('click', closeCommentsPanel);
    }

    // Tab click handlers
    if (commentsTabs) {
        commentsTabs.addEventListener('click', (e) => {
            const tab = e.target.closest('.comments-tab');
            if (!tab) return;

            const tabName = tab.dataset.tab;
            if (tabName === currentCommentsTab) return;

            // Update active tab
            commentsTabs.querySelectorAll('.comments-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Track tab switch
            if (window.cardCounter) {
                window.cardCounter.trackCommentsPanel('tabSwitch_' + tabName);
            }

            // Switch tab content
            currentCommentsTab = tabName;
            switchCommentsTab(tabName);
        });
    }

    // Lazy loading on scroll DOWN (load older comments) - only for 'new' tab
    if (commentsList) {
        commentsList.addEventListener('scroll', () => {
            if (isLoadingComments || !commentsHasMore || currentCommentsTab !== 'new') return;

            // Load more when scrolling near bottom
            const { scrollTop, scrollHeight, clientHeight } = commentsList;
            if (scrollTop + clientHeight >= scrollHeight - 100) {
                loadMoreComments();
            }
        });
    }

    // Subscribe to comments count for badge
    setTimeout(() => {
        if (window.cardCounter && window.cardCounter.subscribeToCommentsCount) {
            window.cardCounter.subscribeToCommentsCount(updateCommentsCountBadge);
        }
    }, 1000);
}

// Update comments button visibility based on current page state
function updateCommentsBtnVisibility() {
    const commentsBtn = document.getElementById('commentsBtn');
    if (!commentsBtn) return;

    const mainPage = document.getElementById('mainPage');
    const resultPanel = document.getElementById('resultPanel');

    // Hide only on card spread (mainPage visible but result not active)
    if (mainPage && mainPage.classList.contains('visible')) {
        if (!resultPanel || !resultPanel.classList.contains('active')) {
            commentsBtn.style.display = 'none';
            return;
        }
    }

    // Show on result page
    commentsBtn.style.display = 'flex';
}

function switchCommentsTab(tabName) {
    // Reset state
    commentsLastKey = null;
    commentsHasMore = true;
    displayedCommentIds.clear();
    expandedCommentCard = null;
    navigatedCommentCard = null;

    // Unsubscribe from real-time updates
    if (window.cardCounter && window.cardCounter.unsubscribeFromNewComments) {
        window.cardCounter.unsubscribeFromNewComments();
    }

    // Hide cardview tab when switching to other tabs
    if (tabName !== 'cardview') {
        const cardviewTab = document.querySelector('[data-tab="cardview"]');
        if (cardviewTab) {
            cardviewTab.style.display = 'none';
        }
    }

    // Load content for the selected tab
    if (tabName === 'new') {
        newestCommentTimestamp = 0;
        loadComments(true);
    } else if (tabName === 'hot') {
        loadHotComments();
    } else if (tabName === 'mycard') {
        loadMyCardComments();
    } else if (tabName === 'me') {
        loadMyComments();
    } else if (tabName === 'cardview') {
        loadCardViewComments();
    }
}

function updateCommentsCountBadge(count) {
    const badge = document.getElementById('commentsCount');
    if (!badge) return;

    if (count > 0) {
        badge.textContent = count > 99 ? '99+' : count;
        badge.classList.add('show');
    } else {
        badge.classList.remove('show');
    }
}

// Track displayed comment IDs to avoid duplicates
let displayedCommentIds = new Set();

// Track the newest comment timestamp from initial load (to filter real-time updates)
let newestCommentTimestamp = 0;

// Track currently expanded comment card
let expandedCommentCard = null;
let navigatedCommentCard = null; // Track the card that was navigated from related comments

// Get or create loading element for comments list
function getOrCreateLoadingEl() {
    let loadingEl = document.getElementById('commentsLoading');
    if (!loadingEl) {
        loadingEl = document.createElement('div');
        loadingEl.className = 'comments-loading';
        loadingEl.id = 'commentsLoading';
        loadingEl.innerHTML = '<span>' + t('common.loading') + '</span>';
    }
    return loadingEl;
}

function openCommentsPanel() {
    const commentsPanel = document.getElementById('commentsPanel');
    const commentsOverlay = document.getElementById('commentsOverlay');
    const commentsTabs = document.getElementById('commentsTabs');

    commentsPanel.classList.add('show');
    commentsOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Push state for back button handling on mobile
    if (!window.commentsPanelHistoryPushed) {
        history.pushState({ commentsPanel: true }, '', '');
        window.commentsPanelHistoryPushed = true;
    }

    // Track comments panel opened
    if (window.cardCounter) {
        window.cardCounter.trackCommentsPanel('opened');
    }

    // Update user name display
    updateCommentsPanelUser();

    // Reset tab to "new"
    currentCommentsTab = 'new';
    if (commentsTabs) {
        commentsTabs.querySelectorAll('.comments-tab').forEach(t => t.classList.remove('active'));
        const newTab = commentsTabs.querySelector('[data-tab="new"]');
        if (newTab) newTab.classList.add('active');
    }

    // Check if user has comments and show/hide "ของฉัน" tab
    checkUserHasComments();

    // Check if user has picked a card and show/hide "ไพ่ฉัน" tab
    checkMyCardTab();

    // Reset and load comments (subscription happens after load completes)
    commentsLastKey = null;
    commentsHasMore = true;
    displayedCommentIds.clear();
    newestCommentTimestamp = 0;
    loadComments(true);
}

// Check if user has any comments and show/hide the "Me" tab
async function checkUserHasComments() {
    const commentsTabs = document.getElementById('commentsTabs');
    if (!commentsTabs) return;

    const meTab = commentsTabs.querySelector('[data-tab="me"]');
    if (!meTab) return;

    // Hide by default first
    meTab.style.display = 'none';

    // Check if user has a saved name - if not, don't show the tab
    const savedName = getSavedUserName();
    if (!savedName) {
        return;
    }

    // Check if Firebase is ready
    if (!window.cardCounter || !window.cardCounter.fetchCommentsByUserId) {
        return;
    }

    // Check if user has any comments
    const userId = getUserId();
    const userComments = await window.cardCounter.fetchCommentsByUserId(userId, 1);

    if (userComments.length > 0) {
        meTab.style.display = '';
    }
}

// Check if user has any comments and show/hide the "ไพ่ฉัน" tab
async function checkMyCardTab() {
    const commentsTabs = document.getElementById('commentsTabs');
    if (!commentsTabs) return;

    const myCardTab = commentsTabs.querySelector('[data-tab="mycard"]');
    if (!myCardTab) return;

    // Hide by default
    myCardTab.style.display = 'none';

    // Check if Firebase is ready
    if (!window.cardCounter || !window.cardCounter.fetchCommentsByUserId) {
        return;
    }

    // Check if user has any comments
    const userId = getUserId();
    const comments = await window.cardCounter.fetchCommentsByUserId(userId, 1);

    if (comments.length > 0) {
        myCardTab.style.display = '';
        myCardTab.textContent = t('comments.tabMyCard');
    }
}

function updateCommentsPanelUser() {
    const userElement = document.getElementById('commentsPanelUser');
    if (!userElement) return;

    const savedName = getSavedUserName();
    if (savedName) {
        userElement.textContent = savedName;
        userElement.classList.remove('anonymous');
    } else {
        userElement.textContent = 'Anonymous';
        userElement.classList.add('anonymous');
    }
}

// Navigate to draw card page from comments panel CTA
function goToDrawFromComments() {
    // Close comments panel first
    closeCommentsPanel();

    // If on result page, close result first
    const resultPanel = document.getElementById('resultPanel');
    if (resultPanel && resultPanel.classList.contains('active')) {
        closeResult();
        return;
    }

    // If on landing page, trigger the card to start
    const landingPage = document.getElementById('landingPage');
    if (landingPage && !landingPage.classList.contains('hidden')) {
        const spinningCard = document.getElementById('spinningCard');
        if (spinningCard) {
            spinningCard.click();
        }
    }
}

function closeCommentsPanel(fromBackButton = false) {
    const commentsPanel = document.getElementById('commentsPanel');
    const commentsOverlay = document.getElementById('commentsOverlay');

    // Only close if panel is actually open
    if (!commentsPanel.classList.contains('show')) return;

    commentsPanel.classList.remove('show');
    commentsOverlay.classList.remove('show');
    document.body.style.overflow = '';

    // Handle history state - go back if not triggered by back button
    if (window.commentsPanelHistoryPushed && !fromBackButton) {
        window.commentsPanelHistoryPushed = false;
        history.back();
    } else {
        window.commentsPanelHistoryPushed = false;
    }

    // Track comments panel closed
    if (window.cardCounter) {
        window.cardCounter.trackCommentsPanel('closed');
    }

    // Reset expanded card state
    expandedCommentCard = null;
    navigatedCommentCard = null;

    // Unsubscribe from real-time updates
    if (window.cardCounter && window.cardCounter.unsubscribeFromNewComments) {
        window.cardCounter.unsubscribeFromNewComments();
    }
}

// Handle browser back button for comments panel
window.addEventListener('popstate', () => {
    const commentsPanel = document.getElementById('commentsPanel');
    if (commentsPanel && commentsPanel.classList.contains('show')) {
        closeCommentsPanel(true);
    }
});

// Handle new comment from real-time listener
function handleNewComment(comment) {
    // Skip if already displayed
    if (displayedCommentIds.has(comment.id)) return;

    // Skip older comments that are coming from child_added for existing data
    // Only prepend comments that are truly new (timestamp > newestCommentTimestamp)
    const commentTimestamp = comment.timestamp || 0;
    if (commentTimestamp <= newestCommentTimestamp) return;

    const commentsList = document.getElementById('commentsList');
    if (!commentsList) return;

    // Remove empty message if exists
    const emptyMsg = commentsList.querySelector('.comments-empty');
    if (emptyMsg) {
        emptyMsg.remove();
    }

    // Create and prepend new comment card at the top
    const card = createCommentCard(comment);
    card.classList.add('new-comment');

    // Insert at top (after loading element if visible)
    const loadingEl = document.getElementById('commentsLoading');
    if (loadingEl && loadingEl.style.display !== 'none') {
        loadingEl.after(card);
    } else if (commentsList.firstChild) {
        commentsList.insertBefore(card, commentsList.firstChild);
    } else {
        commentsList.appendChild(card);
    }

    // Track this comment as displayed
    displayedCommentIds.add(comment.id);

    // Update newest timestamp
    newestCommentTimestamp = commentTimestamp;

    // Scroll to top to show new comment
    commentsList.scrollTop = 0;

    // Remove animation class after animation
    setTimeout(() => {
        card.classList.remove('new-comment');
    }, 500);
}

async function loadComments(reset = false) {
    if (isLoadingComments) return;
    isLoadingComments = true;

    const commentsList = document.getElementById('commentsList');
    const loadingEl = getOrCreateLoadingEl();

    if (reset) {
        commentsList.innerHTML = '';
        commentsList.appendChild(loadingEl);
        loadingEl.style.display = 'block';
        expandedCommentCard = null; // Reset expanded card state
        commentsLastKey = null;
    }

    if (!window.cardCounter || !window.cardCounter.fetchComments) {
        loadingEl.innerHTML = '<span>' + t('common.loadError') + '</span>';
        isLoadingComments = false;
        return;
    }

    // On first load, fetch top comments by replies first
    if (reset && window.cardCounter.fetchTopCommentsByReplies) {
        const topComments = await window.cardCounter.fetchTopCommentsByReplies(3);

        if (topComments.length > 0) {
            // Create top comments section header
            const topSection = document.createElement('div');
            topSection.className = 'comments-top-section';
            topSection.innerHTML = '<div class="comments-section-title">' + t('sections.popular') + '</div>';
            commentsList.appendChild(topSection);

            // Add top comments
            topComments.forEach(comment => {
                const card = createCommentCard(comment, true); // true = show reply count
                commentsList.appendChild(card);
                displayedCommentIds.add(comment.id);
            });

            // Add separator for recent comments
            const recentHeader = document.createElement('div');
            recentHeader.className = 'comments-section-title recent';
            recentHeader.innerHTML = t('sections.recent');
            commentsList.appendChild(recentHeader);
        }
    }

    const result = await window.cardCounter.fetchComments(commentsLastKey, 10);

    loadingEl.style.display = 'none';

    if (result.comments.length === 0 && reset && displayedCommentIds.size === 0) {
        // Set timestamp to current time so older existing comments won't be prepended
        newestCommentTimestamp = Date.now();

        commentsList.innerHTML = `
            <div class="comments-empty">
                <div class="comments-empty-icon">💬</div>
                <div class="comments-empty-text">${t('cta.beFirstComment')}</div>
            </div>
        `;
        isLoadingComments = false;

        // Subscribe to real-time updates even when empty
        if (window.cardCounter && window.cardCounter.subscribeToNewComments) {
            window.cardCounter.subscribeToNewComments(handleNewComment);
        }
        return;
    }

    // Track the newest comment timestamp for real-time filtering
    if (reset && result.comments.length > 0) {
        newestCommentTimestamp = result.comments[0].timestamp || Date.now();
    }

    // Show newest at top, oldest at bottom (default order from fetchComments)
    result.comments.forEach(comment => {
        // Skip if already displayed (from top section or real-time update)
        if (displayedCommentIds.has(comment.id)) return;

        const card = createCommentCard(comment);
        commentsList.appendChild(card);
        displayedCommentIds.add(comment.id);
    });

    commentsLastKey = result.lastKey;
    commentsHasMore = result.hasMore;

    isLoadingComments = false;

    // Subscribe to real-time updates after initial load (only on reset/first load)
    if (reset && window.cardCounter && window.cardCounter.subscribeToNewComments) {
        window.cardCounter.subscribeToNewComments(handleNewComment);
    }
}

function loadMoreComments() {
    if (commentsHasMore && !isLoadingComments) {
        loadComments(false);
    }
}

// Load comments for Hot tab (sorted by most replies)
async function loadHotComments() {
    if (isLoadingComments) return;
    isLoadingComments = true;

    const commentsList = document.getElementById('commentsList');
    const loadingEl = getOrCreateLoadingEl();

    commentsList.innerHTML = '';
    commentsList.appendChild(loadingEl);
    loadingEl.style.display = 'block';

    if (!window.cardCounter || !window.cardCounter.fetchHotComments) {
        loadingEl.innerHTML = '<span>' + t('common.loadError') + '</span>';
        isLoadingComments = false;
        return;
    }

    const comments = await window.cardCounter.fetchHotComments(30);

    loadingEl.style.display = 'none';

    if (comments.length === 0) {
        commentsList.innerHTML = `
            <div class="comments-empty">
                <div class="comments-empty-icon">🔥</div>
                <div class="comments-empty-text">${t('common.noHotComments')}<br>${t('common.tryReply')}</div>
            </div>
        `;
        isLoadingComments = false;
        return;
    }

    // Display all hot comments with reply count badge
    comments.forEach(comment => {
        const card = createCommentCard(comment, true);
        commentsList.appendChild(card);
        displayedCommentIds.add(comment.id);
    });

    isLoadingComments = false;
}

// Load comments for Me tab (user's own comments)
async function loadMyComments() {
    if (isLoadingComments) return;
    isLoadingComments = true;

    const commentsList = document.getElementById('commentsList');
    const loadingEl = getOrCreateLoadingEl();

    commentsList.innerHTML = '';
    commentsList.appendChild(loadingEl);
    loadingEl.style.display = 'block';

    const userId = getUserId();

    if (!window.cardCounter || !window.cardCounter.fetchCommentsByUserId) {
        loadingEl.innerHTML = '<span>' + t('common.loadError') + '</span>';
        isLoadingComments = false;
        return;
    }

    const comments = await window.cardCounter.fetchCommentsByUserId(userId, 50);

    loadingEl.style.display = 'none';

    if (comments.length === 0) {
        commentsList.innerHTML = `
            <div class="comments-empty comments-empty-cta">
                <div class="cta-sparkles">
                    <span class="sparkle s1">✦</span>
                    <span class="sparkle s2">✧</span>
                    <span class="sparkle s3">✦</span>
                </div>
                <div class="cta-card-icon">
                    <svg viewBox="0 0 60 80" fill="none">
                        <rect x="5" y="5" width="50" height="70" rx="4" stroke="currentColor" stroke-width="2" fill="none"/>
                        <path d="M30 25 L35 35 L45 37 L38 44 L40 55 L30 50 L20 55 L22 44 L15 37 L25 35 Z" fill="currentColor" opacity="0.3"/>
                        <circle cx="30" cy="40" r="8" stroke="currentColor" stroke-width="1.5" fill="none"/>
                        <text x="30" y="44" text-anchor="middle" font-size="10" fill="currentColor">?</text>
                    </svg>
                </div>
                <div class="comments-empty-text">${t('cta.notAccepted')}</div>
                <p class="cta-subtitle">${t('cta.drawToReceive')}</p>
                <button class="cta-draw-btn" onclick="goToDrawFromComments()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="7" height="10" rx="1" transform="rotate(-10 6.5 9)"/>
                        <rect x="14" y="4" width="7" height="10" rx="1" transform="rotate(10 17.5 9)"/>
                    </svg>
                    <span>${t('cta.goDrawCard')}</span>
                </button>
            </div>
        `;
        isLoadingComments = false;
        return;
    }

    // Display user's comments
    comments.forEach(comment => {
        const card = createCommentCard(comment);
        commentsList.appendChild(card);
        displayedCommentIds.add(comment.id);
    });

    isLoadingComments = false;
}

// Load comments for My Card tab (comments on the card user picked)
async function loadMyCardComments() {
    if (isLoadingComments) return;
    isLoadingComments = true;

    const commentsList = document.getElementById('commentsList');
    const loadingEl = getOrCreateLoadingEl();

    commentsList.innerHTML = '';
    commentsList.appendChild(loadingEl);
    loadingEl.style.display = 'block';

    const userId = getUserId();

    if (!window.cardCounter || !window.cardCounter.fetchCommentsByCardId) {
        loadingEl.innerHTML = '<span>' + t('common.loadError') + '</span>';
        isLoadingComments = false;
        return;
    }

    // Track feature usage
    if (window.cardCounter) {
        window.cardCounter.trackFeatureUsage('myCardTab', 'view');
    }

    // Fetch data in parallel
    const [myComments, repliedComments] = await Promise.all([
        window.cardCounter.fetchCommentsByUserId ? window.cardCounter.fetchCommentsByUserId(userId, 50) : [],
        window.cardCounter.fetchCommentsUserRepliedTo ? window.cardCounter.fetchCommentsUserRepliedTo(userId, 20) : []
    ]);

    loadingEl.style.display = 'none';

    // Check if both sections are empty
    const hasMyComments = myComments.length > 0;
    const hasRepliedComments = repliedComments.length > 0;

    if (!hasMyComments && !hasRepliedComments) {
        // No comments and no replies - show CTA
        commentsList.innerHTML = `
            <div class="comments-empty comments-empty-cta">
                <div class="cta-sparkles">
                    <span class="sparkle s1">✦</span>
                    <span class="sparkle s2">✧</span>
                    <span class="sparkle s3">✦</span>
                </div>
                <div class="cta-card-icon">
                    <svg viewBox="0 0 60 80" fill="none">
                        <rect x="5" y="5" width="50" height="70" rx="4" stroke="currentColor" stroke-width="2" fill="none"/>
                        <path d="M30 25 L35 35 L45 37 L38 44 L40 55 L30 50 L20 55 L22 44 L15 37 L25 35 Z" fill="currentColor" opacity="0.3"/>
                        <circle cx="30" cy="40" r="8" stroke="currentColor" stroke-width="1.5" fill="none"/>
                        <text x="30" y="44" text-anchor="middle" font-size="10" fill="currentColor">?</text>
                    </svg>
                </div>
                <div class="comments-empty-text">${t('comments.noComments')}</div>
                <p class="cta-subtitle">${t('comments.goComment')}</p>
                <button class="cta-draw-btn" onclick="switchCommentsTab('new')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                    <span>${t('comments.viewLatest')}</span>
                </button>
            </div>
        `;
        isLoadingComments = false;
        return;
    }

    // ===== Section 1: My Comments =====
    if (hasMyComments) {
        const myCommentsSection = document.createElement('div');
        myCommentsSection.className = 'mycard-section';
        myCommentsSection.innerHTML = `
            <div class="section-divider">
                <span class="section-label">${t('comments.myComments')}</span>
                <span class="section-line"></span>
                <span class="section-count">${myComments.length}</span>
            </div>
        `;
        commentsList.appendChild(myCommentsSection);

        myComments.forEach(comment => {
            const card = createCommentCard(comment);
            commentsList.appendChild(card);
            displayedCommentIds.add(comment.id);
        });
    }

    // ===== Section 2: Comments I've Replied To =====
    if (hasRepliedComments) {
        const repliedSection = document.createElement('div');
        repliedSection.className = 'mycard-section mycard-section-replied';
        repliedSection.innerHTML = `
            <div class="section-divider">
                <span class="section-label">${t('comments.repliedTo')}</span>
                <span class="section-line"></span>
                <span class="section-count">${repliedComments.length}</span>
            </div>
        `;
        commentsList.appendChild(repliedSection);

        // Display replied comments using createCommentCard (same format as other tabs)
        repliedComments.forEach(comment => {
            const card = createCommentCard(comment);
            commentsList.appendChild(card);
            displayedCommentIds.add(comment.id);
        });
    }

    isLoadingComments = false;
}

// Load comments for cardview tab (viewing a specific card's comments from ส่อง button)
async function loadCardViewComments() {
    if (isLoadingComments) return;
    isLoadingComments = true;

    const commentsList = document.getElementById('commentsList');
    const loadingEl = getOrCreateLoadingEl();

    commentsList.innerHTML = '';
    commentsList.appendChild(loadingEl);
    loadingEl.style.display = 'block';

    if (!cardViewData) {
        commentsList.innerHTML = `
            <div class="comments-empty">
                <div class="comments-empty-icon">🃏</div>
                <div class="comments-empty-text">${t('error.cardNotFound')}</div>
            </div>
        `;
        isLoadingComments = false;
        return;
    }

    if (!window.cardCounter || !window.cardCounter.fetchCommentsByCardId) {
        loadingEl.innerHTML = '<span>' + t('common.loadError') + '</span>';
        isLoadingComments = false;
        return;
    }

    const comments = await window.cardCounter.fetchCommentsByCardId(cardViewData.id, null, 50);

    loadingEl.style.display = 'none';

    // Add card image header (overflows from tab)
    const cardHeader = document.createElement('div');
    cardHeader.className = 'cardview-header';
    cardHeader.innerHTML = `
        <div class="cardview-card-wrapper">
            <img class="cardview-card-image" src="images/tarot/${cardViewData.image}" alt="${cardViewData.name}">
            <div class="cardview-card-glow"></div>
        </div>
        <div class="cardview-card-name">${cardViewData.name}</div>
        <div class="cardview-comment-count">${comments.length} ${t('cardview.commentCount')}</div>
    `;
    commentsList.appendChild(cardHeader);

    if (comments.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'comments-empty';
        emptyMsg.innerHTML = `
            <div class="comments-empty-icon">💭</div>
            <div class="comments-empty-text">${t('cardview.noCommentsOnCard')}</div>
        `;
        commentsList.appendChild(emptyMsg);
        isLoadingComments = false;
        return;
    }

    // Display comments for this card
    comments.forEach(comment => {
        const card = createCommentCard(comment);
        commentsList.appendChild(card);
        displayedCommentIds.add(comment.id);
    });

    isLoadingComments = false;
}

function createCommentCard(comment, showReplyBadge = false) {
    const card = document.createElement('div');
    card.className = 'comment-card';

    // Add top-comment class if it has reply count
    if (showReplyBadge && comment.replyCount > 0) {
        card.classList.add('top-comment');
    }

    const date = comment.timestamp ? new Date(comment.timestamp) : new Date();
    const dateStr = formatCommentDate(date);

    // Get card image - use cardImage if available, otherwise construct from cardName
    let cardImagePath = '';
    if (comment.cardImage && comment.cardImage.length > 0) {
        cardImagePath = comment.cardImage;
    } else if (comment.cardName && comment.cardName.length > 0) {
        // Backward compatibility: construct image path from card name
        // Image files are named like "THE LOVERS.png", "THE STAR.png", etc.
        cardImagePath = comment.cardName + '.png';
    }

    const hasImage = cardImagePath.length > 0;
    const imageHtml = hasImage
        ? `<div class="comment-card-image"><img src="images/tarot/${escapeHtml(cardImagePath)}" alt="${escapeHtml(comment.cardName || 'Tarot')}" onerror="this.parentElement.style.display='none'"></div>`
        : '';

    // Reply count badge for top comments
    const replyBadgeHtml = (showReplyBadge && comment.replyCount > 0)
        ? `<div class="comment-reply-badge">💬 ${comment.replyCount} ${t('common.replyCount')}</div>`
        : '';

    card.innerHTML = `
        ${imageHtml}
        <div class="comment-card-content">
            <div class="comment-card-header">
                <span class="comment-card-name">${escapeHtml(comment.userName || 'Anonymous')}</span>
                ${replyBadgeHtml}
            </div>
            <div class="comment-card-text">${escapeHtml(comment.comment || '')}</div>
            <div class="comment-card-date">${dateStr}</div>

            <!-- Expanded content: Interpretation first -->
            <div class="comment-card-full">
                <div class="comment-card-full-title">
                    <span class="comment-card-tarot">${escapeHtml(comment.cardName || 'Tarot')}</span>
                    <span class="comment-card-full-label">${t('common.prophecy')}</span>
                </div>
                <div class="comment-card-full-interpretation"></div>
            </div>

            <!-- Replies section -->
            <div class="comment-card-replies-section">
                <div class="comment-card-replies-title">${t('common.replies')}</div>
                <div class="replies-list"></div>
                <button class="replies-empty-btn" style="display: none;">${t('common.beFirstReply')}</button>

                <!-- Reply button and form at bottom -->
                <div class="comment-card-actions">
                    <button class="reply-btn" data-comment-id="${comment.id}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                        </svg>
                        <span>${t('comment.reply')}</span>
                        <span class="reply-count" style="display: none;">0</span>
                    </button>
                </div>
                <div class="reply-form">
                    <div class="reply-input-wrapper">
                        <input type="text" class="reply-input" placeholder="${t('comment.replyPlaceholder')}" maxlength="150">
                        <button class="reply-submit-btn" disabled>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="22" y1="2" x2="11" y2="13"/>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Related comments at the end -->
            <div class="comment-card-related">
                <div class="comment-card-related-title">${t('common.otherComments')}</div>
                <div class="related-comments-list">
                    <div class="related-comment-loading">${t('common.loading')}</div>
                </div>
            </div>
        </div>
    `;

    // Add class for styling when image is present
    if (hasImage) {
        card.classList.add('with-image');
    }

    // Store comment data for expand functionality
    card.dataset.commentId = comment.id;
    card.dataset.cardId = comment.cardId;
    card.dataset.cardName = comment.cardName || '';

    // Setup reply functionality
    setupReplyFeature(card, comment);

    // Load reply count
    loadReplyCount(card, comment.id);

    // Add click handler for expand (no collapse on same card)
    card.addEventListener('click', (e) => {
        // Don't expand if clicking on interactive elements
        if (e.target.closest('.reply-btn') ||
            e.target.closest('.reply-form') ||
            e.target.closest('.replies-list') ||
            e.target.closest('.comment-card-replies-section') ||
            e.target.closest('.comment-card-related')) {
            return;
        }
        // Don't do anything if already expanded
        if (card.classList.contains('expanded')) {
            return;
        }
        e.stopPropagation();
        toggleCommentCardExpand(card, comment);
    });

    return card;
}

// Setup reply feature for a comment card
function setupReplyFeature(card, comment) {
    const replyBtn = card.querySelector('.reply-btn');
    const replyForm = card.querySelector('.reply-form');
    const replyInput = card.querySelector('.reply-input');
    const replySubmitBtn = card.querySelector('.reply-submit-btn');
    const repliesEmptyBtn = card.querySelector('.replies-empty-btn');

    // Toggle reply form
    replyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        replyForm.classList.toggle('show');
        if (replyForm.classList.contains('show')) {
            replyInput.focus();
        }
    });

    // "Reply first" button - same as reply button
    if (repliesEmptyBtn) {
        repliesEmptyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            replyForm.classList.add('show');
            replyInput.focus();
        });
    }

    // Enable/disable submit button based on input
    replyInput.addEventListener('input', () => {
        replySubmitBtn.disabled = replyInput.value.trim().length === 0;
    });

    // Submit reply
    replySubmitBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const text = replyInput.value.trim();
        if (!text) return;

        replySubmitBtn.disabled = true;
        replyInput.disabled = true;

        const userId = getUserId();
        const userName = getSavedUserName() || 'Anonymous';

        if (window.cardCounter && window.cardCounter.submitReply) {
            const result = await window.cardCounter.submitReply(comment.id, userId, userName, text);

            if (result.success) {
                // Track reply submitted
                if (window.cardCounter) {
                    window.cardCounter.trackFeatureUsage('reply', 'submitted');
                }

                // Clear input and hide form
                replyInput.value = '';
                replyForm.classList.remove('show');

                // Reload replies
                await loadReplies(card, comment.id);

                showToast(t('toast.replySuccess'));
            } else {
                showToast(t('toast.error'));
            }
        }

        replySubmitBtn.disabled = false;
        replyInput.disabled = false;
    });

    // Enter key to submit
    replyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !replySubmitBtn.disabled) {
            replySubmitBtn.click();
        }
    });
}

// Load reply count for a comment
async function loadReplyCount(card, commentId) {
    if (!window.cardCounter || !window.cardCounter.getReplyCount) return;

    const count = await window.cardCounter.getReplyCount(commentId);
    const replyCountEl = card.querySelector('.reply-count');

    if (count > 0) {
        replyCountEl.textContent = count;
        replyCountEl.style.display = 'inline';
    }
}

// Load replies for a comment
async function loadReplies(card, commentId) {
    if (!window.cardCounter || !window.cardCounter.fetchReplies) return;

    const repliesList = card.querySelector('.replies-list');
    const repliesEmptyBtn = card.querySelector('.replies-empty-btn');

    repliesList.innerHTML = '<div class="related-comment-loading">' + t('common.loading') + '</div>';
    if (repliesEmptyBtn) repliesEmptyBtn.style.display = 'none';

    const replies = await window.cardCounter.fetchReplies(commentId);

    if (replies.length > 0) {
        repliesList.innerHTML = replies.map(reply => {
            const replyDate = reply.timestamp ? new Date(reply.timestamp) : new Date();
            const replyDateStr = formatCommentDate(replyDate);
            return `
                <div class="reply-item">
                    <div class="reply-header">
                        <span class="reply-name">${escapeHtml(reply.userName || 'Anonymous')}</span>
                        <span class="reply-date">${replyDateStr}</span>
                    </div>
                    <div class="reply-text">${escapeHtml(reply.text || '')}</div>
                </div>
            `;
        }).join('');

        // Update count on reply button
        const replyCountEl = card.querySelector('.reply-count');
        if (replyCountEl) {
            replyCountEl.textContent = replies.length;
            replyCountEl.style.display = 'inline';
        }

        if (repliesEmptyBtn) repliesEmptyBtn.style.display = 'none';
    } else {
        repliesList.innerHTML = '';
        if (repliesEmptyBtn) repliesEmptyBtn.style.display = 'block';
    }
}

async function toggleCommentCardExpand(card, comment) {
    // If clicking the same card that's expanded, collapse it
    if (expandedCommentCard === card) {
        collapseCommentCard(card);
        expandedCommentCard = null;
        return;
    }

    // Collapse previously expanded card
    if (expandedCommentCard) {
        collapseCommentCard(expandedCommentCard);
    }

    // Expand the clicked card
    await expandCommentCard(card, comment);
    expandedCommentCard = card;

    // Scroll the card into view smoothly
    setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

async function expandCommentCard(card, comment) {
    card.classList.add('expanded');

    // Track comment card expanded
    if (window.cardCounter) {
        window.cardCounter.trackFeatureUsage('commentCard', 'expanded');
    }

    // Load full interpretation from tarotData
    const interpretationEl = card.querySelector('.comment-card-full-interpretation');
    if (interpretationEl) {
        if (tarotData && tarotData.cards) {
            const tarotCard = tarotData.cards.find(c => c.id === comment.cardId || c.name === comment.cardName);
            if (tarotCard) {
                interpretationEl.textContent = tarotCard.interpretation;
            } else {
                interpretationEl.textContent = t('error.noInterpretation');
            }
        } else {
            interpretationEl.textContent = t('common.loading');
        }
    }

    // Auto-load replies
    await loadReplies(card, comment.id);

    // Load related comments
    const relatedListEl = card.querySelector('.related-comments-list');
    if (!relatedListEl) {
        console.warn('relatedListEl not found in card');
        return;
    }
    relatedListEl.innerHTML = '<div class="related-comment-loading">' + t('common.loading') + '</div>';

    if (window.cardCounter && window.cardCounter.fetchCommentsByCardId) {
        const relatedComments = await window.cardCounter.fetchCommentsByCardId(
            comment.cardId,
            comment.id,
            5
        );

        if (relatedComments.length > 0) {
            // Fetch reply counts for all related comments
            const relatedWithReplyCounts = await Promise.all(
                relatedComments.map(async (rc) => {
                    let replyCount = 0;
                    if (window.cardCounter && window.cardCounter.getReplyCount) {
                        replyCount = await window.cardCounter.getReplyCount(rc.id);
                    }
                    return { ...rc, replyCount };
                })
            );

            relatedListEl.innerHTML = relatedWithReplyCounts.map(rc => {
                const rcDate = rc.timestamp ? new Date(rc.timestamp) : new Date();
                const rcDateStr = formatCommentDate(rcDate);
                const replyBadge = rc.replyCount > 0
                    ? `<span class="related-comment-replies">💬 ${rc.replyCount}</span>`
                    : '';
                // Store full comment data as JSON for direct use
                const commentDataJson = JSON.stringify({
                    id: rc.id,
                    cardId: rc.cardId,
                    cardName: rc.cardName,
                    cardImage: rc.cardImage || '',
                    userName: rc.userName || 'Anonymous',
                    comment: rc.comment || '',
                    timestamp: rc.timestamp
                });
                return `
                    <div class="related-comment" data-comment-id="${rc.id}" data-comment='${commentDataJson.replace(/'/g, "&#39;")}' style="cursor: pointer;">
                        <div class="related-comment-header">
                            <span class="related-comment-name">${escapeHtml(rc.userName || 'Anonymous')}</span>
                            ${replyBadge}
                            <span class="related-comment-date">${rcDateStr}</span>
                        </div>
                        <div class="related-comment-text">${escapeHtml(rc.comment || '')}</div>
                    </div>
                `;
            }).join('');

            // Add click handlers to navigate to related comments
            relatedListEl.querySelectorAll('.related-comment').forEach((el, index) => {
                const commentData = relatedWithReplyCounts[index];
                el.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    navigateToRelatedComment(commentData);
                });
            });
        } else {
            relatedListEl.innerHTML = '<div class="related-comment-empty">' + t('cardview.noOtherComments') + '</div>';
        }
    } else {
        relatedListEl.innerHTML = '<div class="related-comment-empty">' + t('common.loadError') + '</div>';
    }
}

function collapseCommentCard(card) {
    card.classList.remove('expanded');

    // If this is a navigated card, fade it out and remove it
    if (card.classList.contains('navigated-card')) {
        card.classList.add('fading-out');
        setTimeout(() => {
            if (card.parentNode) card.remove();
        }, 300);
        if (navigatedCommentCard === card) {
            navigatedCommentCard = null;
        }
    }
}

async function navigateToRelatedComment(commentData) {
    // Track navigate to related comment
    if (window.cardCounter) {
        window.cardCounter.trackFeatureUsage('relatedComment', 'navigate');
    }

    try {
        const commentsList = document.getElementById('commentsList');
        if (!commentsList) return;

        // Collapse any currently expanded card first
        if (expandedCommentCard) {
            collapseCommentCard(expandedCommentCard);
            expandedCommentCard = null;
        }

        // Remove previous navigated card with fade animation (keep original cards intact)
        if (navigatedCommentCard && navigatedCommentCard.parentNode) {
            navigatedCommentCard.classList.add('fading-out');
            const oldCard = navigatedCommentCard;
            navigatedCommentCard = null;
            await new Promise(resolve => setTimeout(resolve, 300));
            if (oldCard.parentNode) oldCard.remove();
        }

        // Create a duplicated card (don't remove original) and insert at the TOP of the list
        const newCard = createCommentCard(commentData, false);
        newCard.classList.add('navigated-card'); // Mark as navigated

        // Always insert at the very top of the comments list
        const firstChild = commentsList.firstChild;
        if (firstChild) {
            commentsList.insertBefore(newCard, firstChild);
        } else {
            commentsList.appendChild(newCard);
        }

        // Track displayed ID and navigated card
        displayedCommentIds.add(commentData.id);
        navigatedCommentCard = newCard;

        // Scroll to the card
        newCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Wait for scroll, then expand
        await new Promise(resolve => setTimeout(resolve, 300));
        await expandCommentCard(newCard, commentData);
        expandedCommentCard = newCard;

    } catch (error) {
        console.error('Error navigating to related comment:', error);
        showToast(t('toast.error'));
    }
}

function formatCommentDate(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t('time.justNow');
    if (minutes < 60) return `${minutes} ${t('time.minutesAgo')}`;
    if (hours < 24) return `${hours} ${t('time.hoursAgo')}`;
    if (days < 7) return `${days} ${t('time.daysAgo')}`;

    // Use locale-appropriate date format
    const locale = currentLang === 'th' ? 'th-TH' :
                   currentLang === 'ja' ? 'ja-JP' :
                   currentLang === 'ko' ? 'ko-KR' :
                   currentLang === 'zh-CN' ? 'zh-CN' :
                   currentLang === 'zh-TW' ? 'zh-TW' : 'en-US';
    return date.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize comments panel on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initLanguageSwitcher();
    initCommentsPanel();
    updateCommentsBtnVisibility();
});

// Save Image Functions
let currentCardData = null;

function saveImage(platform) {
    if (!currentCardData) {
        showToast(t('image.selectFirst'));
        return;
    }

    // Track save image
    if (window.cardCounter) window.cardCounter.trackSaveImage(platform);

    const sizes = {
        'ig-story': { width: 1080, height: 1920 },
        'square': { width: 1080, height: 1080 },
        'facebook': { width: 1200, height: 630 },
        'wide': { width: 1200, height: 630 }
    };

    const size = sizes[platform];
    if (!size) return;

    showToast(t('image.creating'));

    const canvas = document.createElement('canvas');
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext('2d');

    // Load card image
    const cardImg = new Image();
    cardImg.crossOrigin = 'anonymous';
    cardImg.onload = () => {
        drawShareImage(ctx, cardImg, size, platform);

        // Download
        const link = document.createElement('a');
        link.download = `valentine-tarot-${currentCardData.name.toLowerCase().replace(/\s+/g, '-')}-${platform}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        showToast(t('image.saved'));
    };
    cardImg.onerror = () => {
        // Draw without card image
        drawShareImage(ctx, null, size, platform);

        const link = document.createElement('a');
        link.download = `valentine-tarot-${currentCardData.name.toLowerCase().replace(/\s+/g, '-')}-${platform}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        showToast(t('image.saved'));
    };
    cardImg.src = `images/tarot/${currentCardData.image}`;
}

function drawShareImage(ctx, cardImg, size, platform) {
    const { width, height } = size;
    const isVertical = height > width;
    const isWide = width > height;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#FDF8F3');
    gradient.addColorStop(0.5, '#FAF0E6');
    gradient.addColorStop(1, '#F5E6D3');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative border
    ctx.strokeStyle = '#722F37';
    ctx.lineWidth = isWide ? 6 : 8;
    const borderPadding = isWide ? 20 : 30;
    ctx.strokeRect(borderPadding, borderPadding, width - borderPadding * 2, height - borderPadding * 2);

    // Inner decorative line
    ctx.strokeStyle = 'rgba(114, 47, 55, 0.3)';
    ctx.lineWidth = 2;
    const innerPadding = borderPadding + 15;
    ctx.strokeRect(innerPadding, innerPadding, width - innerPadding * 2, height - innerPadding * 2);

    // Layout based on platform
    if (isVertical) {
        // Story layout (vertical)
        drawVerticalLayout(ctx, cardImg, width, height);
    } else if (isWide) {
        // Facebook layout (wide)
        drawWideLayout(ctx, cardImg, width, height);
    } else {
        // Square layout (IG post, LINE)
        drawSquareLayout(ctx, cardImg, width, height);
    }
}

// Draw social media icons (4 icons: IG, TikTok, FB, YouTube)
function drawSocialIcons(ctx, x, y, size, color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 0.07;

    const gap = size * 1.4; // Gap between icons
    let currentX = x;
    const radius = size * 0.2;

    // Instagram icon
    ctx.beginPath();
    ctx.roundRect(currentX, y, size, size, radius);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(currentX + size/2, y + size/2, size * 0.28, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(currentX + size * 0.75, y + size * 0.25, size * 0.07, 0, Math.PI * 2);
    ctx.fill();

    currentX += gap;

    // TikTok icon
    ctx.beginPath();
    ctx.roundRect(currentX, y, size, size, radius);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(currentX + size * 0.58, y + size * 0.15);
    ctx.lineTo(currentX + size * 0.58, y + size * 0.65);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(currentX + size * 0.42, y + size * 0.7, size * 0.18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(currentX + size * 0.58, y + size * 0.22);
    ctx.quadraticCurveTo(currentX + size * 0.85, y + size * 0.18, currentX + size * 0.85, y + size * 0.38);
    ctx.stroke();

    currentX += gap;

    // Facebook icon
    ctx.beginPath();
    ctx.roundRect(currentX, y, size, size, radius);
    ctx.stroke();
    ctx.font = `bold ${size * 0.65}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('f', currentX + size/2, y + size * 0.72);

    currentX += gap;

    // Youtube icon
    ctx.beginPath();
    ctx.roundRect(currentX, y, size, size, radius);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(currentX + size * 0.38, y + size * 0.3);
    ctx.lineTo(currentX + size * 0.38, y + size * 0.7);
    ctx.lineTo(currentX + size * 0.72, y + size * 0.5);
    ctx.closePath();
    ctx.fill();

    return currentX + size;
}

// Draw LINE icon only
function drawLineIcon(ctx, x, y, size, color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 0.07;
    const radius = size * 0.2;

    ctx.beginPath();
    ctx.roundRect(x, y, size, size, radius);
    ctx.stroke();
    ctx.font = `bold ${size * 0.5}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('L', x + size/2, y + size * 0.68);
}

function drawVerticalLayout(ctx, cardImg, width, height) {
    // Card image - large and centered at top
    let cardBottomY = 100;
    if (cardImg) {
        const cardWidth = 520;
        const cardHeight = cardWidth * (cardImg.height / cardImg.width);
        const cardX = (width - cardWidth) / 2;
        const cardY = 100;

        // Card shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 40;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 20;

        ctx.drawImage(cardImg, cardX, cardY, cardWidth, cardHeight);
        ctx.shadowColor = 'transparent';
        cardBottomY = cardY + cardHeight;
    }

    // Card name - right after card
    const nameY = cardBottomY + 80;
    ctx.fillStyle = '#722F37';
    ctx.font = 'bold 64px "Cormorant Garamond", serif';
    ctx.textAlign = 'center';
    ctx.fillText(currentCardData.name, width / 2, nameY);

    // Decorative line under name
    ctx.strokeStyle = 'rgba(114, 47, 55, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 180, nameY + 25);
    ctx.lineTo(width / 2 + 180, nameY + 25);
    ctx.stroke();

    // Quote
    ctx.font = 'italic 36px "Cormorant Garamond", serif';
    ctx.fillStyle = 'rgba(114, 47, 55, 0.85)';
    const quote = `"${currentCardData.quote}"`;
    wrapText(ctx, quote, width / 2, nameY + 90, width - 160, 48);

    // Interpretation section
    const interpretY = nameY + 200;

    // Divider
    ctx.strokeStyle = 'rgba(114, 47, 55, 0.3)';
    ctx.beginPath();
    ctx.moveTo(120, interpretY);
    ctx.lineTo(width - 120, interpretY);
    ctx.stroke();

    // Interpretation label
    ctx.font = 'bold 28px "Prompt", sans-serif';
    ctx.fillStyle = '#722F37';
    ctx.fillText(t('common.prophecy'), width / 2, interpretY + 50);

    // Interpretation text - full text with bounds (preserve paragraph breaks)
    ctx.font = '26px "Prompt", sans-serif';
    ctx.fillStyle = '#722F37';
    const maxInterpretY = height - 180; // Leave space for footer
    wrapTextWithParagraphsCenter(ctx, currentCardData.interpretation, width / 2, interpretY + 110, width - 160, 38, maxInterpretY);

    // Footer - 2 columns layout with divider
    const iconSize = 26;
    const footerColor = 'rgba(114, 47, 55, 0.6)';
    const footerY = height - 120;

    // Calculate widths for centering
    const leftIconsWidth = iconSize * 1.4 * 3 + iconSize; // 4 icons
    const rightIconWidth = iconSize;
    const gap = 100; // Gap between two columns
    const totalWidth = leftIconsWidth + gap + rightIconWidth;
    const startX = (width - totalWidth) / 2;

    // Left column: 4 social icons + Pimfahmaprod
    drawSocialIcons(ctx, startX, footerY, iconSize, footerColor);
    ctx.textAlign = 'center';
    ctx.font = '20px "Prompt", sans-serif';
    ctx.fillStyle = footerColor;
    ctx.fillText('Pimfahmaprod', startX + leftIconsWidth / 2, footerY + iconSize + 28);

    // Right column: LINE icon + Line: @Pimfah
    const lineIconX = startX + leftIconsWidth + gap;
    drawLineIcon(ctx, lineIconX, footerY, iconSize, footerColor);
    ctx.textAlign = 'center';
    ctx.font = '20px "Prompt", sans-serif';
    ctx.fillStyle = footerColor;
    ctx.fillText('Line: @Pimfah', lineIconX + iconSize / 2, footerY + iconSize + 28);
}

function drawSquareLayout(ctx, cardImg, width, height) {
    // Border padding for safe area - generous margin from border
    const safePadding = 80;

    // Card image - left side, large and vertically centered
    let cardRightX = 450;
    if (cardImg) {
        const cardHeight = height - 200; // More vertical padding
        const cardWidth = cardHeight * (cardImg.width / cardImg.height);
        const cardX = safePadding + 10;
        const cardY = 100;

        // Card shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 30;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 15;

        ctx.drawImage(cardImg, cardX, cardY, cardWidth, cardHeight);
        ctx.shadowColor = 'transparent';
        cardRightX = cardX + cardWidth + 35;
    }

    // Right side - Text area with safe margins
    const textX = cardRightX;
    const textWidth = width - textX - safePadding - 10; // More right padding

    // Title small
    ctx.fillStyle = 'rgba(114, 47, 55, 0.6)';
    ctx.font = '22px "Cormorant Garamond", serif';
    ctx.textAlign = 'left';
    ctx.fillText('Valentine Tarot', textX, 140);

    // Card name - large (with dynamic sizing to fit)
    ctx.fillStyle = '#722F37';
    let nameFontSize = 48;
    ctx.font = `bold ${nameFontSize}px "Cormorant Garamond", serif`;
    let nameWidth = ctx.measureText(currentCardData.name).width;
    while (nameWidth > textWidth && nameFontSize > 26) {
        nameFontSize -= 2;
        ctx.font = `bold ${nameFontSize}px "Cormorant Garamond", serif`;
        nameWidth = ctx.measureText(currentCardData.name).width;
    }
    ctx.fillText(currentCardData.name, textX, 195);

    // Decorative line
    ctx.strokeStyle = 'rgba(114, 47, 55, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(textX, 220);
    ctx.lineTo(textX + Math.min(180, textWidth - 20), 220);
    ctx.stroke();

    // Quote
    ctx.font = 'italic 22px "Cormorant Garamond", serif';
    ctx.fillStyle = 'rgba(114, 47, 55, 0.85)';
    const quote = `"${currentCardData.quote}"`;
    wrapTextLeft(ctx, quote, textX, 265, textWidth, 30);

    // Interpretation - full text with bounds (preserve paragraph breaks)
    ctx.font = '17px "Prompt", sans-serif';
    ctx.fillStyle = '#722F37';
    const maxInterpretY = height - safePadding - 100; // Leave space for footer within safe area
    wrapTextWithParagraphs(ctx, currentCardData.interpretation, textX, 360, textWidth, 25, maxInterpretY);

    // Footer - 2 columns layout with divider
    const iconSize = 18;
    const footerColor = 'rgba(114, 47, 55, 0.55)';
    const footerY = height - safePadding - 40;
    const gap = 50;

    // Left column: 4 social icons + Pimfahmaprod
    drawSocialIcons(ctx, textX, footerY, iconSize, footerColor);
    const leftIconsWidth = iconSize * 1.4 * 3 + iconSize;
    ctx.textAlign = 'center';
    ctx.font = '14px "Prompt", sans-serif';
    ctx.fillStyle = footerColor;
    ctx.fillText('Pimfahmaprod', textX + leftIconsWidth / 2, footerY + iconSize + 20);

    // Right column: LINE icon + Line: @Pimfah
    const lineIconX = textX + leftIconsWidth + gap;
    drawLineIcon(ctx, lineIconX, footerY, iconSize, footerColor);
    ctx.textAlign = 'center';
    ctx.font = '14px "Prompt", sans-serif';
    ctx.fillStyle = footerColor;
    ctx.fillText('Line: @Pimfah', lineIconX + iconSize / 2, footerY + iconSize + 20);
}

function drawWideLayout(ctx, cardImg, width, height) {
    // Left side: Card image - fill height
    let cardRightX = 350;
    if (cardImg) {
        const cardHeight = height - 100;
        const cardWidth = cardHeight * (cardImg.width / cardImg.height);
        const cardX = 50;
        const cardY = 50;

        // Card shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 25;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 12;

        ctx.drawImage(cardImg, cardX, cardY, cardWidth, cardHeight);
        ctx.shadowColor = 'transparent';
        cardRightX = cardX + cardWidth + 50;
    }

    // Right side: Text - starts after card
    const textX = cardRightX;
    const textWidth = width - textX - 60;

    // Title small
    ctx.fillStyle = 'rgba(114, 47, 55, 0.6)';
    ctx.font = '20px "Cormorant Garamond", serif';
    ctx.textAlign = 'left';
    ctx.fillText('Valentine Tarot', textX, 80);

    // Card name - prominent (with dynamic sizing to fit)
    ctx.fillStyle = '#722F37';
    let nameFontSize = 42;
    ctx.font = `bold ${nameFontSize}px "Cormorant Garamond", serif`;
    let nameWidth = ctx.measureText(currentCardData.name).width;
    while (nameWidth > textWidth && nameFontSize > 24) {
        nameFontSize -= 2;
        ctx.font = `bold ${nameFontSize}px "Cormorant Garamond", serif`;
        nameWidth = ctx.measureText(currentCardData.name).width;
    }
    ctx.fillText(currentCardData.name, textX, 125);

    // Decorative line
    ctx.strokeStyle = 'rgba(114, 47, 55, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(textX, 145);
    ctx.lineTo(textX + 200, 145);
    ctx.stroke();

    // Quote
    ctx.font = 'italic 20px "Cormorant Garamond", serif';
    ctx.fillStyle = 'rgba(114, 47, 55, 0.9)';
    const quote = `"${currentCardData.quote}"`;
    wrapTextLeft(ctx, quote, textX, 180, textWidth, 26);

    // Interpretation - full text with bounds (preserve paragraph breaks)
    ctx.font = '16px "Prompt", sans-serif';
    ctx.fillStyle = '#722F37';
    const maxInterpretY = height - 90; // Leave space for footer
    wrapTextWithParagraphs(ctx, currentCardData.interpretation, textX, 260, textWidth, 22, maxInterpretY);

    // Footer - 2 columns layout with divider
    const iconSize = 14;
    const footerColor = 'rgba(114, 47, 55, 0.55)';
    const footerY = height - 62;
    const gap = 40;

    // Left column: 4 social icons + Pimfahmaprod
    drawSocialIcons(ctx, textX, footerY, iconSize, footerColor);
    const leftIconsWidth = iconSize * 1.4 * 3 + iconSize;
    ctx.textAlign = 'center';
    ctx.font = '12px "Prompt", sans-serif';
    ctx.fillStyle = footerColor;
    ctx.fillText('Pimfahmaprod', textX + leftIconsWidth / 2, footerY + iconSize + 16);

    // Right column: LINE icon + Line: @Pimfah
    const lineIconX = textX + leftIconsWidth + gap;
    drawLineIcon(ctx, lineIconX, footerY, iconSize, footerColor);
    ctx.textAlign = 'center';
    ctx.font = '12px "Prompt", sans-serif';
    ctx.fillStyle = footerColor;
    ctx.fillText('Line: @Pimfah', lineIconX + iconSize / 2, footerY + iconSize + 16);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxY = Infinity) {
    const words = text.split(' ');
    let line = '';
    let testLine = '';

    for (let i = 0; i < words.length; i++) {
        testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
            if (y > maxY) {
                // Add ellipsis to last visible line
                ctx.fillText(line.trim() + '...', x, y - lineHeight);
                return y;
            }
            ctx.fillText(line.trim(), x, y);
            line = words[i] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    if (y <= maxY + lineHeight) {
        ctx.fillText(line.trim(), x, y);
    }
    return y;
}

// Text wrapping with paragraph support (centered) - for Story layout
function wrapTextWithParagraphsCenter(ctx, text, x, y, maxWidth, lineHeight, maxY = Infinity) {
    ctx.textAlign = 'center';
    const paragraphs = text.split('\n\n');
    const paragraphGap = lineHeight * 0.5;

    for (let p = 0; p < paragraphs.length; p++) {
        const paragraph = paragraphs[p].replace(/\n/g, ' ').trim();
        if (!paragraph) continue;

        const words = paragraph.split(' ');
        let line = '';

        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);

            if (metrics.width > maxWidth) {
                if (line.length > 0) {
                    if (y + lineHeight > maxY) {
                        ctx.fillText(line.trim() + '...', x, y);
                        return y;
                    }
                    ctx.fillText(line.trim(), x, y);
                    y += lineHeight;
                    line = '';
                }

                // Handle long words
                if (ctx.measureText(word).width > maxWidth) {
                    let charLine = '';
                    for (let j = 0; j < word.length; j++) {
                        const testCharLine = charLine + word[j];
                        if (ctx.measureText(testCharLine).width > maxWidth && charLine.length > 0) {
                            if (y + lineHeight > maxY) {
                                ctx.fillText(charLine + '...', x, y);
                                return y;
                            }
                            ctx.fillText(charLine, x, y);
                            y += lineHeight;
                            charLine = word[j];
                        } else {
                            charLine = testCharLine;
                        }
                    }
                    line = charLine + ' ';
                } else {
                    line = word + ' ';
                }
            } else {
                line = testLine;
            }
        }

        // Draw remaining text of this paragraph
        if (line.trim().length > 0 && y <= maxY) {
            ctx.fillText(line.trim(), x, y);
            y += lineHeight;
        }

        // Add paragraph gap
        if (p < paragraphs.length - 1 && y <= maxY) {
            y += paragraphGap;
        }
    }
    return y;
}

// Text wrapping with paragraph support - adds extra space for \n\n
function wrapTextWithParagraphs(ctx, text, x, y, maxWidth, lineHeight, maxY = Infinity) {
    ctx.textAlign = 'left';
    const paragraphs = text.split('\n\n');
    const paragraphGap = lineHeight * 0.5; // Extra space between paragraphs

    for (let p = 0; p < paragraphs.length; p++) {
        const paragraph = paragraphs[p].replace(/\n/g, ' ').trim();
        if (!paragraph) continue;

        const words = paragraph.split(' ');
        let line = '';

        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);

            if (metrics.width > maxWidth) {
                if (line.length > 0) {
                    // Check boundary before drawing
                    if (y + lineHeight > maxY) {
                        ctx.fillText(line.trim() + '...', x, y);
                        return y;
                    }
                    ctx.fillText(line.trim(), x, y);
                    y += lineHeight;
                    line = '';
                }

                // Handle long words by breaking at character level
                if (ctx.measureText(word).width > maxWidth) {
                    let charLine = '';
                    for (let j = 0; j < word.length; j++) {
                        const testCharLine = charLine + word[j];
                        if (ctx.measureText(testCharLine).width > maxWidth && charLine.length > 0) {
                            if (y + lineHeight > maxY) {
                                ctx.fillText(charLine + '...', x, y);
                                return y;
                            }
                            ctx.fillText(charLine, x, y);
                            y += lineHeight;
                            charLine = word[j];
                        } else {
                            charLine = testCharLine;
                        }
                    }
                    line = charLine + ' ';
                } else {
                    line = word + ' ';
                }
            } else {
                line = testLine;
            }
        }

        // Draw remaining text of this paragraph
        if (line.trim().length > 0 && y <= maxY) {
            ctx.fillText(line.trim(), x, y);
            y += lineHeight;
        }

        // Add paragraph gap (except for last paragraph)
        if (p < paragraphs.length - 1 && y <= maxY) {
            y += paragraphGap;
        }
    }
    return y;
}

// Thai-aware text wrapping - handles long Thai words by breaking at character level
function wrapTextThaiAware(ctx, text, x, y, maxWidth, lineHeight, maxY = Infinity) {
    ctx.textAlign = 'left';
    const words = text.split(' ');
    let line = '';

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth) {
            if (line.length > 0) {
                // Check if next line would exceed boundary
                if (y + lineHeight > maxY) {
                    ctx.fillText(line.trim() + '...', x, y);
                    return y;
                }
                ctx.fillText(line.trim(), x, y);
                y += lineHeight;
                line = '';
            }

            // If single word is too long, break it character by character
            if (ctx.measureText(word).width > maxWidth) {
                let charLine = '';
                for (let j = 0; j < word.length; j++) {
                    const testCharLine = charLine + word[j];
                    if (ctx.measureText(testCharLine).width > maxWidth && charLine.length > 0) {
                        if (y + lineHeight > maxY) {
                            ctx.fillText(charLine + '...', x, y);
                            return y;
                        }
                        ctx.fillText(charLine, x, y);
                        y += lineHeight;
                        charLine = word[j];
                    } else {
                        charLine = testCharLine;
                    }
                }
                line = charLine + ' ';
            } else {
                line = word + ' ';
            }
        } else {
            line = testLine;
        }
    }

    // Draw remaining text only if within bounds
    if (line.trim().length > 0 && y <= maxY) {
        ctx.fillText(line.trim(), x, y);
    }
    return y;
}

function wrapTextLeft(ctx, text, x, y, maxWidth, lineHeight, maxY = Infinity) {
    ctx.textAlign = 'left';
    const words = text.split(' ');
    let line = '';
    let testLine = '';

    for (let i = 0; i < words.length; i++) {
        testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
            // Check if next line would exceed boundary
            if (y + lineHeight > maxY) {
                ctx.fillText(line.trim() + '...', x, y);
                return y;
            }
            ctx.fillText(line.trim(), x, y);
            line = words[i] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    // Draw remaining text only if within bounds
    if (y <= maxY) {
        ctx.fillText(line.trim(), x, y);
    }
    return y;
}

// Initialize - wait for all resources before showing the page
waitForResources();

// ========================================
// Setup mute button and audio (runs immediately since script is at end of body)
// ========================================
(function setupAudioControls() {
    // Initialize audio element
    const audio = initAudioElement();

    const muteBtn = document.getElementById('muteBtn');

    if (muteBtn) {
        // Handle both click and touch
        function handleMuteClick(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMute(e);
        }

        muteBtn.addEventListener('click', handleMuteClick);
        muteBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            handleMuteClick(e);
        });

        console.log('Mute button initialized');
    }

    // Add audio event listeners for indicator
    if (audio) {
        audio.addEventListener('play', () => {
            console.log('Audio play event');
            updateSoundIndicator(true);
        });
        audio.addEventListener('pause', () => {
            console.log('Audio pause event');
            updateSoundIndicator(false);
        });
        audio.addEventListener('ended', () => {
            console.log('Audio ended event');
            updateSoundIndicator(false);
        });
        audio.addEventListener('error', (e) => {
            console.log('Audio error:', e);
            updateSoundIndicator(false);
        });
    }

    // Add one-time listener to start music on first user interaction
    function startMusicOnInteraction() {
        tryPlayMusic();
        // Remove listeners after first interaction
        document.removeEventListener('click', startMusicOnInteraction);
        document.removeEventListener('touchstart', startMusicOnInteraction);
    }

    document.addEventListener('click', startMusicOnInteraction);
    document.addEventListener('touchstart', startMusicOnInteraction);

    console.log('Audio setup complete - waiting for user interaction');
})();

// =============================================
// Ranking Panel
// =============================================
(function initRankingPanel() {
    const totalCounter = document.getElementById('totalCounter');
    const rankingPanel = document.getElementById('rankingPanel');
    const rankingOverlay = document.getElementById('rankingOverlay');
    const rankingList = document.getElementById('rankingList');

    if (!totalCounter || !rankingPanel || !rankingOverlay) return;

    // Trophy icons for each rank
    const trophyIcons = ['🥇', '🥈', '🥉', '🏅', '🎖️'];

    // Open ranking panel
    totalCounter.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (!totalCounter.classList.contains('show')) return;

        rankingPanel.classList.add('show');
        rankingOverlay.classList.add('show');

        // Track ranking panel opened
        if (window.cardCounter) {
            window.cardCounter.trackRankingPanel('opened');
        }

        await loadRankings();
    });

    // Close ranking panel
    rankingOverlay.addEventListener('click', closeRankingPanel);

    function closeRankingPanel() {
        rankingPanel.classList.remove('show');
        rankingOverlay.classList.remove('show');

        // Track ranking panel closed
        if (window.cardCounter) {
            window.cardCounter.trackRankingPanel('closed');
        }
    }

    // Load and display rankings
    async function loadRankings() {
        if (!window.cardCounter || !window.cardCounter.fetchCardRankings) {
            rankingList.innerHTML = '<div class="ranking-loading">ไม่สามารถโหลดข้อมูลได้</div>';
            return;
        }

        rankingList.innerHTML = '<div class="ranking-loading">' + t('common.loading') + '</div>';

        try {
            const rankings = await window.cardCounter.fetchCardRankings(5);

            if (rankings.length === 0) {
                rankingList.innerHTML = '<div class="ranking-loading">ยังไม่มีข้อมูล</div>';
                return;
            }

            // Get total picks for percentage calculation
            const totalPicks = await window.cardCounter.getTotal();
            const totalCount = totalPicks || rankings.reduce((sum, r) => sum + r.count, 0);

            // Get card data from tarotData
            const rankingHTML = rankings.map((rank, index) => {
                const cardData = (tarotData && tarotData.cards) ? tarotData.cards.find(c => c.id == rank.cardId) : null;
                const cardNameRaw = cardData ? cardData.name : `Card ${rank.cardId}`;
                const cardNameDisplay = getCardName(cardNameRaw);
                const cardImage = cardData ? `images/tarot/${cardData.image}` : '';
                const percentage = totalCount > 0 ? ((rank.count / totalCount) * 100).toFixed(1) : 0;

                return `
                    <div class="ranking-item">
                        <span class="ranking-trophy">${trophyIcons[index] || '🎖️'}</span>
                        ${cardImage ? `<img src="${cardImage}" alt="${cardNameDisplay}" class="ranking-card-image">` : ''}
                        <span class="ranking-card-name">${escapeHtml(cardNameDisplay)}</span>
                        <span class="ranking-count">${percentage}%</span>
                    </div>
                `;
            }).join('');

            rankingList.innerHTML = rankingHTML;
        } catch (error) {
            console.error('Error loading rankings:', error);
            rankingList.innerHTML = '<div class="ranking-loading">เกิดข้อผิดพลาด</div>';
        }
    }
})();

// ========================================
// Analytics Page - Secret Access
// ========================================
(function() {
    let brandClickCount = 0;
    let lastClickTime = 0;
    const REQUIRED_CLICKS = 10;
    const CLICK_TIMEOUT = 3000; // Reset if no click within 3 seconds

    // Initialize analytics secret access
    function initAnalyticsAccess() {
        const landingBrand = document.querySelector('.landing-brand');
        if (!landingBrand) return;

        landingBrand.style.cursor = 'pointer';
        landingBrand.addEventListener('click', handleBrandClick);
    }

    function handleBrandClick(e) {
        e.preventDefault();
        e.stopPropagation();

        const now = Date.now();

        // Reset count if too much time passed
        if (now - lastClickTime > CLICK_TIMEOUT) {
            brandClickCount = 0;
        }

        lastClickTime = now;
        brandClickCount++;

        // Subtle feedback
        if (brandClickCount >= 5 && brandClickCount < REQUIRED_CLICKS) {
            e.target.style.transform = `scale(${1 + (brandClickCount * 0.02)})`;
            setTimeout(() => {
                e.target.style.transform = '';
            }, 100);
        }

        // Open analytics when reached
        if (brandClickCount >= REQUIRED_CLICKS) {
            brandClickCount = 0;
            openAnalytics();
        }
    }

    // Open analytics page
    window.openAnalytics = async function() {
        const analyticsPage = document.getElementById('analyticsPage');
        if (!analyticsPage) return;

        // Pause background music
        if (audioElement && !audioElement.paused) {
            audioElement.pause();
        }

        analyticsPage.classList.add('show');
        document.body.style.overflow = 'hidden';

        // Load analytics data
        await loadAnalyticsData();
    };

    // Close analytics page
    window.closeAnalytics = function() {
        const analyticsPage = document.getElementById('analyticsPage');
        if (!analyticsPage) return;

        analyticsPage.classList.remove('show');
        document.body.style.overflow = '';

        // Resume music if was playing
        if (audioElement && !isMuted && musicStarted) {
            audioElement.play().catch(() => {});
        }
    };

    // Load all analytics data
    async function loadAnalyticsData() {
        if (!window.cardCounter || !window.cardCounter.isEnabled()) {
            showAnalyticsError('Firebase ยังไม่ได้เชื่อมต่อ');
            return;
        }

        // Load all data in parallel
        await Promise.all([
            loadOverviewStats(),
            loadTopCards(),
            loadSaveFormatStats(),
            loadShareStats(),
            loadSocialStats(),
            loadJourneyFunnel(),
            loadTimeToPickStats(),
            loadDeviceStats(),
            loadFeatureUsageStats(),
            loadPositionHeatmap(),
            loadScrollDepthStats(),
            loadHotComments()
        ]);
    }

    // Load overview statistics
    async function loadOverviewStats() {
        try {
            const database = firebase.database();

            // Total card picks
            const totalPicks = await window.cardCounter.getTotal();
            document.getElementById('statTotalPicks').textContent =
                totalPicks ? totalPicks.toLocaleString('th-TH') : '0';

            // Total comments
            const commentsCount = await window.cardCounter.getCommentsCount();
            document.getElementById('statTotalComments').textContent =
                commentsCount ? commentsCount.toLocaleString('th-TH') : '0';

            // Total replies
            const repliesSnapshot = await database.ref('replies').once('value');
            let totalReplies = 0;
            if (repliesSnapshot.exists()) {
                repliesSnapshot.forEach(commentReplies => {
                    totalReplies += commentReplies.numChildren();
                });
            }
            document.getElementById('statTotalReplies').textContent =
                totalReplies.toLocaleString('th-TH');

            // Total saves
            const savesSnapshot = await database.ref('buttonClicks/save').once('value');
            let totalSaves = 0;
            if (savesSnapshot.exists()) {
                savesSnapshot.forEach(format => {
                    totalSaves += format.val() || 0;
                });
            }
            document.getElementById('statTotalSaves').textContent =
                totalSaves.toLocaleString('th-TH');

        } catch (error) {
            console.error('Error loading overview stats:', error);
        }
    }

    // Load all 78 cards grid
    async function loadTopCards() {
        const container = document.getElementById('allCardsGrid');
        if (!container) return;

        try {
            const database = firebase.database();
            const snapshot = await database.ref('cardPicks').once('value');
            const data = snapshot.val() || {};

            // Build pick count map
            const pickCounts = {};
            Object.entries(data).forEach(([key, count]) => {
                const cardId = key.replace('card_', '');
                pickCounts[cardId] = count || 0;
            });

            // Get all 78 cards from tarotData
            if (!tarotData || !tarotData.cards) {
                container.innerHTML = '<div class="analytics-empty">ยังไม่โหลดข้อมูลไพ่</div>';
                return;
            }

            // Sort cards by pick count (descending)
            const sortedCards = [...tarotData.cards].sort((a, b) => {
                const countA = pickCounts[a.id] || 0;
                const countB = pickCounts[b.id] || 0;
                return countB - countA;
            });

            let html = '';
            sortedCards.forEach((card, index) => {
                const count = pickCounts[card.id] || 0;
                const cardImage = `images/tarot/${card.image}`;

                // Rank styling for top 3
                let rankBadge = '';
                if (index === 0) rankBadge = '<span class="card-grid-rank gold">1</span>';
                else if (index === 1) rankBadge = '<span class="card-grid-rank silver">2</span>';
                else if (index === 2) rankBadge = '<span class="card-grid-rank bronze">3</span>';

                html += `
                    <div class="card-grid-item" title="${card.name}">
                        ${rankBadge}
                        <img src="${cardImage}" alt="${card.name}" class="card-grid-image">
                        <div class="card-grid-count">${count}</div>
                    </div>
                `;
            });

            container.innerHTML = html;

        } catch (error) {
            console.error('Error loading all cards:', error);
            container.innerHTML = '<div class="analytics-empty">เกิดข้อผิดพลาด</div>';
        }
    }

    // Load save format statistics
    async function loadSaveFormatStats() {
        const container = document.getElementById('saveFormatChart');

        try {
            const database = firebase.database();
            const snapshot = await database.ref('buttonClicks/save').once('value');
            const data = snapshot.val();

            if (!data) {
                container.innerHTML = '<div class="analytics-empty">ยังไม่มีข้อมูล</div>';
                return;
            }

            const formats = [
                { key: 'ig-story', label: 'IG Story', class: 'ig-story' },
                { key: 'square', label: 'IG Post', class: 'square' },
                { key: 'facebook', label: 'Facebook', class: 'facebook' },
                { key: 'wide', label: 'Wide', class: 'wide' }
            ];

            const maxValue = Math.max(...formats.map(f => data[f.key] || 0), 1);

            let html = '<div class="chart-bar-container">';
            formats.forEach(format => {
                const value = data[format.key] || 0;
                const percentage = ((value / maxValue) * 100).toFixed(0);

                html += `
                    <div class="chart-bar-item">
                        <span class="chart-bar-label">${format.label}</span>
                        <div class="chart-bar-track">
                            <div class="chart-bar-fill ${format.class}" style="width: ${percentage}%">
                                <span class="chart-bar-value">${value.toLocaleString('th-TH')}</span>
                            </div>
                        </div>
                    </div>
                `;
            });
            html += '</div>';

            container.innerHTML = html;

        } catch (error) {
            console.error('Error loading save format stats:', error);
            container.innerHTML = '<div class="analytics-empty">เกิดข้อผิดพลาด</div>';
        }
    }

    // Load share platform statistics
    async function loadShareStats() {
        const container = document.getElementById('sharePlatformChart');

        try {
            const database = firebase.database();
            const snapshot = await database.ref('buttonClicks/share').once('value');
            const data = snapshot.val();

            if (!data) {
                container.innerHTML = '<div class="analytics-empty">ยังไม่มีข้อมูล</div>';
                return;
            }

            const platforms = [
                { key: 'messenger', label: 'Messenger', class: 'messenger' },
                { key: 'line', label: 'LINE', class: 'line' },
                { key: 'copy', label: 'Copy Link', class: 'copy' }
            ];

            const maxValue = Math.max(...platforms.map(p => data[p.key] || 0), 1);

            let html = '<div class="chart-bar-container">';
            platforms.forEach(platform => {
                const value = data[platform.key] || 0;
                const percentage = ((value / maxValue) * 100).toFixed(0);

                html += `
                    <div class="chart-bar-item">
                        <span class="chart-bar-label">${platform.label}</span>
                        <div class="chart-bar-track">
                            <div class="chart-bar-fill ${platform.class}" style="width: ${percentage}%">
                                <span class="chart-bar-value">${value.toLocaleString('th-TH')}</span>
                            </div>
                        </div>
                    </div>
                `;
            });
            html += '</div>';

            container.innerHTML = html;

        } catch (error) {
            console.error('Error loading share stats:', error);
            container.innerHTML = '<div class="analytics-empty">เกิดข้อผิดพลาด</div>';
        }
    }

    // Load social link click statistics
    async function loadSocialStats() {
        const container = document.getElementById('socialStatsGrid');

        try {
            const database = firebase.database();
            const snapshot = await database.ref('buttonClicks/social').once('value');
            const data = snapshot.val() || {};

            const igIcon = '<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>';
            const ttIcon = '<svg viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>';
            const fbIcon = '<svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>';
            const ytIcon = '<svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>';
            const lineIcon = '<svg viewBox="0 0 24 24"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>';

            const socials = [
                { key: 'instagram', bkey: 'blessing_instagram', label: 'Instagram', class: 'instagram', icon: igIcon },
                { key: 'tiktok', bkey: 'blessing_tiktok', label: 'TikTok', class: 'tiktok', icon: ttIcon },
                { key: 'facebook', bkey: 'blessing_facebook', label: 'Facebook', class: 'facebook', icon: fbIcon },
                { key: 'youtube', bkey: null, label: 'YouTube', class: 'youtube', icon: ytIcon },
                { key: null, bkey: 'blessing_line', label: 'LINE (Blessing)', class: 'line', icon: lineIcon }
            ];

            let html = '';
            socials.forEach(social => {
                const footerValue = social.key ? (data[social.key] || 0) : 0;
                const blessingValue = social.bkey ? (data[social.bkey] || 0) : 0;
                const totalValue = footerValue + blessingValue;
                const breakdown = social.bkey && social.key ?
                    `<div class="social-breakdown">Footer: ${footerValue} / Blessing: ${blessingValue}</div>` :
                    '';
                html += `
                    <div class="social-stat-card ${social.class}">
                        <div class="social-stat-icon">${social.icon}</div>
                        <div class="social-stat-value">${totalValue.toLocaleString('th-TH')}</div>
                        <div class="social-stat-label">${social.label}</div>
                        ${breakdown}
                    </div>
                `;
            });

            container.innerHTML = html;

        } catch (error) {
            console.error('Error loading social stats:', error);
            container.innerHTML = '<div class="analytics-empty">เกิดข้อผิดพลาด</div>';
        }
    }

    // Load hot comments
    async function loadHotComments() {
        const container = document.getElementById('hotCommentsList');

        try {
            const hotComments = await window.cardCounter.fetchHotComments(5);

            if (!hotComments || hotComments.length === 0) {
                container.innerHTML = '<div class="analytics-empty">ยังไม่มีความคิดเห็น</div>';
                return;
            }

            let html = '';
            hotComments.forEach(comment => {
                html += `
                    <div class="hot-comment-card">
                        <div class="hot-comment-header">
                            <span class="hot-comment-user">${escapeHtml(comment.userName || 'Anonymous')}</span>
                            <span class="hot-comment-replies">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M3 15a4 4 0 0 0 4 4h9a5 5 0 0 0 0-10H9a3 3 0 0 0 0 6h9"/>
                                </svg>
                                ${comment.replyCount || 0} replies
                            </span>
                        </div>
                        <div class="hot-comment-card-name">${escapeHtml(comment.cardName || '')}</div>
                        <div class="hot-comment-text">${escapeHtml(comment.comment || '')}</div>
                    </div>
                `;
            });

            container.innerHTML = html;

        } catch (error) {
            console.error('Error loading hot comments:', error);
            container.innerHTML = '<div class="analytics-empty">เกิดข้อผิดพลาด</div>';
        }
    }

    // Load user journey funnel
    async function loadJourneyFunnel() {
        const container = document.getElementById('journeyFunnel');

        try {
            const database = firebase.database();
            const snapshot = await database.ref('analytics/journey').once('value');
            const data = snapshot.val();

            if (!data) {
                container.innerHTML = '<div class="analytics-empty">ยังไม่มีข้อมูล</div>';
                return;
            }

            const steps = [
                { key: 'landing', label: 'Landing Page' },
                { key: 'pick', label: 'Card Pick' },
                { key: 'result', label: 'View Result' }
            ];

            const landingCount = data.landing || 0;

            let html = '';
            steps.forEach(step => {
                const value = data[step.key] || 0;
                const percentage = landingCount > 0 ? ((value / landingCount) * 100).toFixed(1) : 0;
                const barWidth = landingCount > 0 ? (value / landingCount) * 100 : 0;

                html += `
                    <div class="funnel-step" style="--bar-width: ${barWidth}%">
                        <span class="funnel-step-label">${step.label}</span>
                        <span class="funnel-step-value">${value.toLocaleString('th-TH')}</span>
                        <span class="funnel-step-percent">${percentage}%</span>
                    </div>
                `;
            });

            container.innerHTML = html;

            // Apply bar widths after render
            setTimeout(() => {
                container.querySelectorAll('.funnel-step').forEach(el => {
                    const width = el.style.getPropertyValue('--bar-width');
                    el.style.setProperty('--bar-width', width);
                    el.querySelector('::before')?.style?.setProperty('width', width);
                });
            }, 100);

        } catch (error) {
            console.error('Error loading journey funnel:', error);
            container.innerHTML = '<div class="analytics-empty">เกิดข้อผิดพลาด</div>';
        }
    }

    // Load time to first pick statistics
    async function loadTimeToPickStats() {
        const container = document.getElementById('timeToPickChart');

        try {
            const database = firebase.database();
            const snapshot = await database.ref('analytics/timeToFirstPick').once('value');
            const data = snapshot.val();

            if (!data) {
                container.innerHTML = '<div class="analytics-empty">ยังไม่มีข้อมูล</div>';
                return;
            }

            const buckets = [
                { key: 'instant', label: '< 5s', class: 'instant' },
                { key: 'quick', label: '5-9s', class: 'quick' },
                { key: 'normal', label: '10-29s', class: 'normal' },
                { key: 'medium', label: '30-59s', class: 'medium' },
                { key: 'slow', label: '60s+', class: 'slow' }
            ];

            const maxValue = Math.max(...buckets.map(b => data[b.key] || 0), 1);

            let html = '<div class="chart-bar-container">';
            buckets.forEach(bucket => {
                const value = data[bucket.key] || 0;
                const percentage = ((value / maxValue) * 100).toFixed(0);

                html += `
                    <div class="chart-bar-item">
                        <div class="chart-bar-label">${bucket.label}</div>
                        <div class="chart-bar">
                            <div class="chart-bar-fill ${bucket.class}" style="width: ${percentage}%"></div>
                        </div>
                        <div class="chart-bar-value">${value.toLocaleString('th-TH')}</div>
                    </div>
                `;
            });
            html += '</div>';

            container.innerHTML = html;

        } catch (error) {
            console.error('Error loading time to pick stats:', error);
            container.innerHTML = '<div class="analytics-empty">เกิดข้อผิดพลาด</div>';
        }
    }

    // Load device breakdown statistics
    async function loadDeviceStats() {
        const container = document.getElementById('deviceStatsGrid');

        try {
            const database = firebase.database();
            const snapshot = await database.ref('analytics/devices').once('value');
            const data = snapshot.val();

            if (!data) {
                container.innerHTML = '<div class="analytics-empty">ยังไม่มีข้อมูล</div>';
                return;
            }

            const devices = [
                {
                    key: 'mobile',
                    label: 'Mobile',
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>'
                },
                {
                    key: 'tablet',
                    label: 'Tablet',
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>'
                },
                {
                    key: 'desktop',
                    label: 'Desktop',
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>'
                }
            ];

            const total = devices.reduce((sum, d) => sum + (data[d.key] || 0), 0);

            let html = '';
            devices.forEach(device => {
                const value = data[device.key] || 0;
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;

                html += `
                    <div class="device-stat">
                        <div class="device-icon">${device.icon}</div>
                        <div class="device-name">${device.label}</div>
                        <div class="device-value">${value.toLocaleString('th-TH')}</div>
                        <div class="device-percent">${percentage}%</div>
                    </div>
                `;
            });

            container.innerHTML = html;

        } catch (error) {
            console.error('Error loading device stats:', error);
            container.innerHTML = '<div class="analytics-empty">เกิดข้อผิดพลาด</div>';
        }
    }

    // Load feature usage statistics
    async function loadFeatureUsageStats() {
        const container = document.getElementById('featureUsageGrid');

        try {
            const database = firebase.database();
            const snapshot = await database.ref('analytics/features').once('value');
            const data = snapshot.val();

            if (!data) {
                container.innerHTML = '<div class="analytics-empty">ยังไม่มีข้อมูล</div>';
                return;
            }

            const features = [
                {
                    key: 'music',
                    label: 'Music Control',
                    actions: ['muted', 'unmuted']
                },
                {
                    key: 'commentsPanel',
                    label: 'Comments Panel',
                    actions: ['opened', 'closed', 'tabSwitch_new', 'tabSwitch_hot', 'tabSwitch_mycard', 'tabSwitch_me']
                },
                {
                    key: 'rankingPanel',
                    label: 'Ranking Panel',
                    actions: ['opened', 'closed']
                },
                {
                    key: 'commentForm',
                    label: 'Comment Form',
                    actions: ['started', 'submitted', 'abandoned']
                },
                {
                    key: 'viewCardComments',
                    label: 'View Card Comments (ส่อง)',
                    actions: ['click']
                },
                {
                    key: 'restart',
                    label: 'Restart',
                    actions: ['toLanding']
                },
                {
                    key: 'blessingScreen',
                    label: 'Blessing Screen',
                    actions: ['shown']
                },
                {
                    key: 'reply',
                    label: 'Reply to Comment',
                    actions: ['submitted']
                },
                {
                    key: 'commentCard',
                    label: 'Comment Card',
                    actions: ['expanded']
                },
                {
                    key: 'relatedComment',
                    label: 'Related Comment',
                    actions: ['navigate']
                },
                {
                    key: 'myCardTab',
                    label: 'My Card Tab (ไพ่ฉัน)',
                    actions: ['view']
                }
            ];

            let html = '';
            features.forEach(feature => {
                const featureData = data[feature.key] || {};
                const total = Object.values(featureData).reduce((sum, v) => sum + (v || 0), 0);

                let actionsHtml = '';
                feature.actions.forEach(action => {
                    const value = featureData[action] || 0;
                    actionsHtml += `
                        <div class="feature-action">
                            <span>${action}</span>
                            <span>${value.toLocaleString('th-TH')}</span>
                        </div>
                    `;
                });

                html += `
                    <div class="feature-item">
                        <div class="feature-header">
                            <span class="feature-name">${feature.label}</span>
                            <span class="feature-total">${total.toLocaleString('th-TH')} total</span>
                        </div>
                        <div class="feature-breakdown">
                            ${actionsHtml}
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;

        } catch (error) {
            console.error('Error loading feature usage stats:', error);
            container.innerHTML = '<div class="analytics-empty">เกิดข้อผิดพลาด</div>';
        }
    }

    // Load position heatmap
    async function loadPositionHeatmap() {
        const container = document.getElementById('positionHeatmap');

        try {
            const database = firebase.database();
            const snapshot = await database.ref('analytics/cardPositions').once('value');
            const data = snapshot.val();

            if (!data) {
                container.innerHTML = '<div class="analytics-empty">ยังไม่มีข้อมูล</div>';
                return;
            }

            const positions = [
                { key: 'top', label: 'Top', x: 95, y: 0 },
                { key: 'top-right', label: 'TR', x: 165, y: 30 },
                { key: 'right', label: 'Right', x: 190, y: 95 },
                { key: 'bottom-right', label: 'BR', x: 165, y: 160 },
                { key: 'bottom', label: 'Bottom', x: 95, y: 190 },
                { key: 'bottom-left', label: 'BL', x: 25, y: 160 },
                { key: 'left', label: 'Left', x: 0, y: 95 },
                { key: 'top-left', label: 'TL', x: 25, y: 30 }
            ];

            const total = Object.values(data).reduce((sum, v) => sum + (v || 0), 0);
            const maxValue = Math.max(...Object.values(data), 1);

            let html = '<div class="heatmap-circle">';

            positions.forEach(pos => {
                const value = data[pos.key] || 0;
                const intensity = value / maxValue;
                let heatClass = 'cool';
                if (intensity > 0.7) heatClass = 'hot';
                else if (intensity > 0.4) heatClass = 'warm';

                html += `
                    <div class="heatmap-section ${heatClass}" style="left: ${pos.x}px; top: ${pos.y}px;">
                        <span class="heatmap-section-label">${pos.label}</span>
                        <span class="heatmap-section-value">${value}</span>
                    </div>
                `;
            });

            html += `
                <div class="heatmap-center">
                    <span class="heatmap-center-label">Total</span>
                    <span class="heatmap-center-value">${total.toLocaleString('th-TH')}</span>
                </div>
            `;
            html += '</div>';

            container.innerHTML = html;

        } catch (error) {
            console.error('Error loading position heatmap:', error);
            container.innerHTML = '<div class="analytics-empty">เกิดข้อผิดพลาด</div>';
        }
    }

    // Load scroll depth statistics
    async function loadScrollDepthStats() {
        const container = document.getElementById('scrollDepthChart');

        try {
            const database = firebase.database();
            const snapshot = await database.ref('analytics/interpretationScroll').once('value');
            const data = snapshot.val();

            if (!data) {
                container.innerHTML = '<div class="analytics-empty">ยังไม่มีข้อมูล</div>';
                return;
            }

            const buckets = [
                { key: '0-25', label: '0-25%', class: 'scroll-low' },
                { key: '25-50', label: '25-50%', class: 'scroll-med' },
                { key: '50-75', label: '50-75%', class: 'scroll-high' },
                { key: '75-100', label: '75-100%', class: 'scroll-complete' }
            ];

            const maxValue = Math.max(...buckets.map(b => data[b.key] || 0), 1);

            let html = '<div class="chart-bar-container">';
            buckets.forEach(bucket => {
                const value = data[bucket.key] || 0;
                const percentage = ((value / maxValue) * 100).toFixed(0);

                html += `
                    <div class="chart-bar-item">
                        <div class="chart-bar-label">${bucket.label}</div>
                        <div class="chart-bar">
                            <div class="chart-bar-fill ${bucket.class}" style="width: ${percentage}%"></div>
                        </div>
                        <div class="chart-bar-value">${value.toLocaleString('th-TH')}</div>
                    </div>
                `;
            });
            html += '</div>';

            container.innerHTML = html;

        } catch (error) {
            console.error('Error loading scroll depth stats:', error);
            container.innerHTML = '<div class="analytics-empty">เกิดข้อผิดพลาด</div>';
        }
    }

    function showAnalyticsError(message) {
        const content = document.getElementById('analyticsContent');
        if (content) {
            content.innerHTML = `<div class="analytics-empty" style="margin-top: 100px;">${message}</div>`;
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnalyticsAccess);
    } else {
        initAnalyticsAccess();
    }
})();
