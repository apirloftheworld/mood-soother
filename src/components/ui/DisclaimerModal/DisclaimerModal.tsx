import { ShieldAlert, ArrowRight } from 'lucide-react';
import Modal from '@/components/ui/Modal';

interface DisclaimerModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DisclaimerModal({ open, onConfirm, onCancel }: DisclaimerModalProps) {
  return (
    <Modal open={open} persistent>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'rgba(255,107,107,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <ShieldAlert size={28} color="#ff6b6b" strokeWidth={1.8} />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#333', marginBottom: 12 }}>
          安全提示
        </h3>
        <p style={{
          fontSize: 14, color: '#777', lineHeight: 1.8,
          marginBottom: 24,
        }}>
          发泄模式为虚拟互动，<strong style={{ color: '#555' }}>仅为情绪释放而设计</strong>，不代表鼓励任何形式的暴力。
          <br /><br />
          你输入的名字不会被保存，建议每次控制在 3 分钟以内。
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={onConfirm}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '12px', borderRadius: 14, width: '100%',
              background: 'linear-gradient(135deg, #ff6b6b, #e55a5a)',
              color: '#fff', fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer',
            }}
          >
            我知道了，开始发泄 <ArrowRight size={16} />
          </button>
          <button
            onClick={onCancel}
            style={{
              padding: '10px', borderRadius: 14, width: '100%',
              background: 'transparent', color: '#bbb', fontSize: 14,
              border: 'none', cursor: 'pointer',
            }}
          >
            算了，返回首页
          </button>
        </div>
      </div>
    </Modal>
  );
}
