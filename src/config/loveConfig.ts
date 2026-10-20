import her1 from '../assets/my-photos/her-1.jpg';
import her2 from '../assets/my-photos/her-2.jpg';
import her3 from '../assets/my-photos/her-3.jpg';
import her4 from '../assets/my-photos/her-4.jpg';
import her5 from '../assets/my-photos/her-5.jpg';
import her6 from '../assets/my-photos/her-6.jpg';
import her7 from '../assets/my-photos/her-7.jpg';

export interface LoveConfig {
  herName: string;
  senderName: string;
  grabGiftLink: string;
  phoneNumber: string;
  letterTitle: string;
  letterSalutation: string;
  letterContent: string[];
  wishesContent: string[];
  promisesContent: string[];
  showWishes: boolean;
  showPromises: boolean;
  photos: {
    id: string;
    url: string;
    caption: string;
    date: string;
  }[];
}

export const DEFAULT_LOVE_CONFIG: LoveConfig = {
  herName: 'Mận Mận',
  senderName: 'Anh Yêu',
  grabGiftLink: 'https://food.grab.com/vn/vi/',
  phoneNumber: '',
  letterTitle: 'Những Lời Chúc Ngọt Ngào Nhất Dành Cho Mận Mận',
  letterSalutation: 'Mận Mận thương yêu,',
  letterContent: [
    'Hôm nay là ngày 20/10 - ngày tôn vinh những người phụ nữ tuyệt vời, và người đầu tiên anh nghĩ đến với tất cả sự trân trọng và yêu thương chính là em.',
    'Trong thế giới rộng lớn và bận rộn này, có thể gặp được em, lắng nghe tiếng em cười và có em cùng sẻ chia những khoảnh khắc đời thường là điều may mắn nhất đối với anh.',
    'Anh biết cuộc sống đôi khi có những mệt mỏi, áp lực và những ngày khiến em phải lo toan. Nhưng hãy nhớ rằng, em không cần phải luôn tỏ ra mạnh mẽ. Anh luôn ở đây, sẵn sàng làm chỗ dựa vững chãi, lắng nghe mọi điều em muốn giãi bày và cùng em đi qua mọi thăng trầm.',
    'Chúc công chúa của anh một ngày 20/10 ngập tràn hoa tươi, nụ cười luôn rạng rỡ trên môi, mọi điều ước đều thành hiện thực và mãi là người con gái hạnh phúc nhất.',
  ],
  wishesContent: [
    'Chúc em luôn giữ mãi nụ cười tỏa nắng và mỗi ngày đều tràn đầy năng lượng tích cực.',
    'Chúc công việc của em luôn thuận buồm xuôi gió, mọi dự định đều thành công mỹ mãn.',
    'Mong em luôn cảm nhận được rằng mình là người phụ nữ được yêu thương và nâng niu nhất.',
  ],
  promisesContent: [
    'Luôn lắng nghe em với tất cả sự kiên nhẫn và thấu hiểu.',
    'Là bờ vai ấm áp mỗi khi em cần một điểm tựa bình yên.',
    'Cùng em chia sẻ những điều nhỏ nhặt và tạo nên thật nhiều kỷ niệm đẹp.',
    'Tiếp tục yêu thương, bảo bọc và trân trọng em hơn mỗi ngày trôi qua.',
  ],
  showWishes: true,
  showPromises: true,
  // 7 real photos bundled directly in source code for permanent high-speed loading everywhere
  photos: [
    {
      id: 'photo-1',
      url: her1,
      caption: 'Nụ cười tỏa nắng của Mận Mận',
      date: 'Nàng thơ xinh đẹp của anh',
    },
    {
      id: 'photo-2',
      url: her2,
      caption: 'Khoảnh khắc đáng yêu và rạng ngời',
      date: 'Những ngày bình yên',
    },
    {
      id: 'photo-3',
      url: her3,
      caption: 'Góc nghiêng dịu dàng làm say lòng anh',
      date: 'Khoảnh khắc ngọt ngào',
    },
    {
      id: 'photo-4',
      url: her4,
      caption: 'Ánh mắt trong veo và nụ cười ấm áp',
      date: 'Nụ cười thắp sáng ngày anh',
    },
    {
      id: 'photo-5',
      url: her5,
      caption: 'Mỗi ngày có em là một ngày hạnh phúc',
      date: 'Bên nhau thật trọn vẹn',
    },
    {
      id: 'photo-6',
      url: her6,
      caption: 'Người con gái dịu dàng và tuyệt vời nhất',
      date: 'Mãi yêu em',
    },
    {
      id: 'photo-7',
      url: her7,
      caption: 'Món quà quý giá nhất trong đời anh',
      date: '20 Tháng 10 Đong Đầy Yêu Thương',
    },
  ],
};
