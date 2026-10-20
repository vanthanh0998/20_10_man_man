import girlPortraitImg from '../assets/images/romantic_girl_portrait_soft_1792465474737.jpg';
import cafeDateImg from '../assets/images/romantic_memories_moment_1792465473393.jpg';
import bouquetRosesImg from '../assets/images/romantic_red_roses_bouquet_1792465473755.jpg';
import sunsetCoupleImg from '../assets/images/romantic_couple_sunset_1792465473676.jpg';

export interface LoveConfig {
  herName: string;
  senderName: string;
  grabGiftLink: string;
  phoneNumber: string;
  letterTitle: string;
  letterSalutation: string;
  letterContent: string[];
  photos: {
    id: string;
    url: string;
    caption: string;
    date: string;
  }[];
}

export const DEFAULT_LOVE_CONFIG: LoveConfig = {
  herName: 'Em Yêu',
  senderName: 'Anh Yêu',
  grabGiftLink: 'https://food.grab.com/vn/vi/',
  phoneNumber: '',
  letterTitle: 'Những Lời Chúc Ngọt Ngào Nhất Dành Cho Em',
  letterSalutation: 'Em thương yêu,',
  letterContent: [
    'Hôm nay là ngày 20/10 - ngày tôn vinh những người phụ nữ tuyệt vời, và người đầu tiên anh nghĩ đến với tất cả sự trân trọng và yêu thương chính là em.',
    'Trong thế giới rộng lớn và bận rộn này, có thể gặp được em, lắng nghe tiếng em cười và có em cùng sẻ chia những khoảnh khắc đời thường là điều may mắn nhất đối với anh.',
    'Anh biết cuộc sống đôi khi có những mệt mỏi, áp lực và những ngày khiến em phải lo toan. Nhưng hãy nhớ rằng, em không cần phải luôn tỏ ra mạnh mẽ. Anh luôn ở đây, sẵn sàng làm chỗ dựa vững chãi, lắng nghe mọi điều em muốn giãi bày và cùng em đi qua mọi thăng trầm.',
    'Chúc công chúa của anh một ngày 20/10 ngập tràn hoa tươi, nụ cười luôn rạng rỡ trên môi, mọi điều ước đều thành hiện thực và mãi là người con gái hạnh phúc nhất.',
  ],
  photos: [
    {
      id: 'photo-1',
      url: girlPortraitImg,
      caption: 'Nụ cười tỏa nắng giữa vườn hoa thơm ngát',
      date: 'Nàng thơ của anh',
    },
    {
      id: 'photo-2',
      url: cafeDateImg,
      caption: 'Buổi chiều cà phê hẹn hò cùng cái nắm tay ấm áp',
      date: 'Khoảnh khắc bình yên',
    },
    {
      id: 'photo-3',
      url: bouquetRosesImg,
      caption: 'Bó hoa hồng nhung tươi thắm dành riêng tặng em',
      date: '20 Tháng 10 Ngập Tràn Yêu Thương',
    },
    {
      id: 'photo-4',
      url: sunsetCoupleImg,
      caption: 'Cùng nhau ngắm hoàng hôn thanh bình',
      date: 'Mãi bên nhau em nhé',
    },
  ],
};
