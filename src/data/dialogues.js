export const introPopupLines = [
  "Anh sẽ tham gia một mini game nhỏ mà em đã chuẩn bị cho anh.",
  "Mình sẽ cùng xem tụi mình đã trải qua những gì với nhau.",
  "Cuối con đường sẽ có quà đó hehe.",
];

export const gameDialogues = {
  password_success: [
    {
      speaker: "Em",
      text: "ồ, bồ em giỏi thế.",
    },
  ],
  stage_1_easy: [
    {
      speaker: "NPC giữ cổng",
      text: "A Trà bật đèn rồi. Đi nhẹ thôi, map này em còn thương.",
    },
  ],
  stage_1_hard: [
    {
      speaker: "NPC giữ cổng",
      text: "Sai biệt danh là hơi nghiêm trọng đó nha. Vào map khó để ôn bài.",
    },
  ],
  stage_2_easy: [
    {
      speaker: "Ký ức Đà Lạt",
      text: "Sương xuống chậm thôi, đủ để anh nhớ lại từng đoạn đường.",
    },
  ],
  stage_2_hard: [
    {
      speaker: "Ký ức Đà Lạt",
      text: "Gió hơi lớn, nhưng anh Hoàng đi được mà. Cố lên cục vàng.",
    },
  ],
  stage_3_easy: [
    {
      speaker: "Ánh đèn rạp",
      text: "Một chiếc ghế đỏ, một tấm vé, một checkpoint rất mềm.",
    },
  ],
  stage_3_hard: [
    {
      speaker: "Ánh đèn rạp",
      text: "Suất muộn bắt đầu rồi. Quái hơi đông, nhưng tim anh có armor.",
    },
  ],
  stage_4_easy: [
    {
      speaker: "Micro Rainbow",
      text: "Bài này đúng tông. Đánh quái xong nhớ hát encore nha.",
    },
  ],
  stage_4_hard: [
    {
      speaker: "Micro Rainbow",
      text: "Beat lệch rồi, quái cũng cọc rồi. Bình tĩnh, anh vẫn đẹp trai.",
    },
  ],
  stage_5_easy: [
    {
      speaker: "Steam Dungeon",
      text: "Co-op mode mở sẵn. Chỉ cần anh nhớ game tụi mình chơi nhiều nhất.",
    },
  ],
  stage_5_hard: [
    {
      speaker: "Steam Dungeon",
      text: "Nightmare mode đó nha. Nhưng em tin anh vẫn qua được.",
    },
  ],
  boss_intro: [
    {
      speaker: "Boss Shutdown",
      text: "Nếu ký ức cuối cùng chưa được thắp sáng, hệ thống sẽ tắt.",
    },
    {
      speaker: "Em",
      text: "Anh kiểm tra artifact trước khi đánh hết máu boss nha.",
    },
  ],
  shutdown_ending: [
    {
      speaker: "Boss Shutdown",
      text: "Không tìm thấy artifact đã kích hoạt.",
    },
    {
      speaker: "Hệ thống",
      text: "Shutdown sequence started.",
    },
    {
      speaker: "Em",
      text: "Chưa phải true ending đâu. Lần sau nhớ mang kỷ vật bí mật theo nha.",
    },
  ],
  true_ending: [
    {
      speaker: "Hệ thống",
      text: "Artifact đã sáng. Shutdown bị hủy.",
    },
    {
      speaker: "Em",
      text: "Anh Hoàng tới cuối đường rồi đó hả?",
    },
    {
      speaker: "Em",
      text: "Em đợi anh ở đây nãy giờ luôn.",
    },
    {
      speaker: "Em",
      text: "Chúc mừng sinh nhật cục vàng của em. Quà ở cuối đường là em nè, hehe.",
    },
  ],
};

export const legacyDialogues = {
  atra_intro: [
    "Quán A Trà, nơi anh Hoàng có ấn tượng đầu tiên về em Tấn.",
    "Có những điều nhỏ xíu thôi, nhưng lại làm người ta nhớ rất lâu.",
  ],
  atra_orange: [
    "Hai đứa bé vô gia cư cầm quả cam nhờ bóc.",
    "Em Tấn ngồi xuống bóc giúp liền, không nghĩ nhiều.",
  ],
  dalat_intro: [
    "Đà Lạt, thông, hoa, hoàng hôn và sương nhẹ.",
    "Có những nơi trở thành nơi mình nhận ra lòng mình.",
  ],
  dalat_collect: [
    "Lần đầu ôm nhau.",
    "First kiss: 26/02/2026.",
  ],
  cgv_intro: ["CGV, một buổi tối nhẹ nhàng của tụi mình."],
  cgv_ticket: [
    "Em Tấn: Anh muốn xem phim gì nè?",
    "Anh Hoàng: Cái nào em chọn cũng được.",
  ],
  karaoke_intro: [
    "Karaoke Rainbow, routine thân mật của hai người.",
    "Micro lên, đèn neon bật, và anh Hoàng hát hay hơn anh tưởng.",
  ],
  karaoke_win: ["Encore! Encore!", "Hai đứa mình hát xong rồi mà vẫn muốn hát tiếp."],
  final_path: [
    "Đi thêm chút nữa thôi...",
    "Em đang đợi anh ở cuối con đường.",
  ],
  ending_arrival: ["Anh Hoàng của em tới rồi đó hả?", "Em đợi nãy giờ luôn."],
  ending_sit: ["Ngồi kế bên em đi, cục vàng."],
  ending_ask_day: ["Hôm nay của anh thế nào?"],
  ending_ask_tired: ["Anh đi tới đây có mệt không?"],
  ending_wipe: ["Để em lau mồ hôi cho..."],
  ending_kiss: ["Critical Hit: Love Damage +9999"],
  ending_love_damage: [
    "Anh Hoàng: ...!!!",
    "(hồn lìa khỏi xác, đỏ mặt, ngại ngùng phê phê)",
  ],
  ending_reward: ["You received: A Birthday Letter"],
};

export const dialogues = legacyDialogues;

export const getDialogue = (dialogueKey) => gameDialogues[dialogueKey] ?? [];
