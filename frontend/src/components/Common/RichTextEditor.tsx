import React, { useState } from 'react';
import { Input, Button, Space, Card, Tabs } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  FontSizeOutlined,
  LinkOutlined,
  PictureOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  EyeOutlined,
  EditOutlined
} from '@ant-design/icons';

const { TextArea } = Input;

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write content here (supports Markdown)...',
  rows = 12
}) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('markdown-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = before + (selected || 'text') + after;

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    onChange(newValue);

    // Refocus & reset selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + (selected || 'text').length);
    }, 50);
  };

  const toolbarActions = [
    { icon: <BoldOutlined />, label: 'Bold', action: () => insertText('**', '**') },
    { icon: <ItalicOutlined />, label: 'Italic', action: () => insertText('*', '*') },
    { icon: <FontSizeOutlined />, label: 'Heading', action: () => insertText('### ') },
    { icon: <LinkOutlined />, label: 'Link', action: () => insertText('[', '](url)') },
    { icon: <PictureOutlined />, label: 'Image', action: () => insertText('![alt text](', ')') },
    { icon: <UnorderedListOutlined />, label: 'Bullet List', action: () => insertText('- ') },
    { icon: <OrderedListOutlined />, label: 'Number List', action: () => insertText('1. ') }
  ];

  // A safe, lightweight RegExp-based Markdown compiler for live preview
  const parseMarkdown = (markdown: string) => {
    if (!markdown) return '<p style="color:var(--text-muted);">Nothing to preview</p>';
    
    let html = markdown;
    
    // Escaping simple HTML tags
    html = html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Markdown Rules
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Images
    html = html.replace(/\!\[(.*?)\]\((.*?)\)/gim, "<img src='$2' alt='$1' style='max-width:100%; border-radius:6px; margin: 8px 0; display:block;' />");
    
    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2' target='_blank' style='color:#00629B; text-decoration:underline;'>$1</a>");
    
    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre style="background:var(--bg-base); padding:12px; border-radius:6px; font-family: monospace; overflow-x:auto;">$1</pre>');
    
    // Lists
    html = html.replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>');
    html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<li>$1</li>');

    // Line breaks
    html = html.replace(/\n/g, '<br />');

    return html;
  };

  return (
    <Card
      style={{
        background: 'var(--bg-surface)',
        borderColor: 'var(--border-color)',
        borderRadius: '8px'
      }}
      styles={{ body: { padding: '0px' } }}
    >
      {/* Editor Header / Toolbar */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <Space size={4}>
          {toolbarActions.map((item, idx) => (
            <Button
              key={idx}
              type="text"
              size="small"
              icon={item.icon}
              title={item.label}
              onClick={item.action}
              style={{ color: 'var(--text-main)' }}
            />
          ))}
        </Space>
        
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as 'write' | 'preview')}
          size="small"
          style={{ marginBottom: -12 }}
          items={[
            { key: 'write', label: <span><EditOutlined /> Write</span> },
            { key: 'preview', label: <span><EyeOutlined /> Preview</span> }
          ]}
        />
      </div>

      {/* Editor Body */}
      <div style={{ padding: '16px' }}>
        {activeTab === 'write' ? (
          <TextArea
            id="markdown-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            style={{
              fontFamily: 'monospace',
              background: 'transparent',
              color: 'var(--text-main)',
              borderColor: 'transparent',
              boxShadow: 'none',
              padding: 0,
              resize: 'vertical'
            }}
          />
        ) : (
          <div
            style={{
              minHeight: rows * 20,
              color: 'var(--text-main)',
              overflowY: 'auto'
            }}
            dangerouslySetInnerHTML={{ __html: parseMarkdown(value) }}
          />
        )}
      </div>
    </Card>
  );
};
