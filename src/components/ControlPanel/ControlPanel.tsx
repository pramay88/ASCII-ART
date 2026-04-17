import React, { useState, useEffect } from 'react';
import styles from './ControlPanel.module.css';
import { Slider } from '../ui/Slider';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Sidebar, SidebarContent, SidebarHeader } from '../ui/Sidebar';
import { useAppState } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { getCharsetOptions } from '../../core/CharacterSets';
import { RenderMode, CharsetName, ThemeName } from '../../core/types';
import {
  Camera,
  Image as ImageIcon,
  PanelLeftClose,
  PanelLeftOpen,
  Save,
  Folder,
  Monitor,
  Settings,
  Eye,
  Type,
  Palette,
  Download,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface ControlPanelProps {
  isOpen: boolean;
  onToggleSidebar: () => void;
  onClose: () => void;
  onPickImage: () => void;
  onPickVideo: () => void;
  onStartWebcam: () => void;
  onStopSource: () => void;
  onExportText: () => void;
  onExportHtml: () => void;
  onExportImage: () => void;
  onToggleRecording: () => void;
}

function Section({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader} onClick={() => setOpen(!open)}>
        <span className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>{Icon}</span>
          {title}
        </span>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>
          <ChevronDown size={14} />
        </span>
      </div>
      {open && <div className={styles.sectionBody}>{children}</div>}
    </div>
  );
}

export function ControlPanel({
  isOpen,
  onToggleSidebar,
  onClose,
  onPickImage,
  onPickVideo,
  onStartWebcam,
  onStopSource,
  onExportText,
  onExportHtml,
  onExportImage,
  onToggleRecording,
}: ControlPanelProps) {
  const { state, dispatch } = useAppState();
  const { theme, setTheme, customColor, setCustomColor } = useTheme();
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Ensure custom color is synced when theme changes to custom
  useEffect(() => {
    if (theme === 'custom' && customColor) {
      if (typeof window !== 'undefined') {
        document.documentElement.style.setProperty('--ascii-color', customColor);
      }
    }
  }, [theme, customColor]);

  const renderModes: { value: RenderMode; label: string }[] = [
    { value: 'grayscale', label: 'Grayscale' },
    { value: 'colored', label: 'Colored' },
    { value: 'edge', label: 'Edges' },
    { value: 'inverted', label: 'Inverted' },
  ];

  const themes: { value: ThemeName; label: string; color: string }[] = [
    { value: 'dark', label: 'Dark', color: '#1a1a2e' },
    { value: 'light', label: 'Light', color: '#f0f0f5' },
  ];

  return (
    <div className={styles.sidebarShell}>
      <button
        className={styles.sidebarToggle}
        onClick={onToggleSidebar}
        aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {isOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
      </button>
      <Sidebar className={styles.panel} collapsible open={isOpen}>
        <SidebarHeader className={styles.panelHeader}>
          <div className={cn(styles.logoText, !isOpen && styles.logoTextHidden)}>
            ASCII ART STUDIOS
          </div>
        </SidebarHeader>

        <SidebarContent className={cn(styles.panelContent, !isOpen && styles.panelContentHidden)}>
          {/* ── Input Source ── */}
          <Section title="Input Source" icon={<Folder size={16} />}>
            <div className={styles.inputGrid}>
              <button
                className={`${styles.inputButton} ${state.source === 'image' || state.source === 'video' ? styles.active : ''}`}
                onClick={onPickImage}
                title="Load image or video"
              >
                <span className={styles.inputButtonIcon}>
                  <ImageIcon size={16} />
                </span>
                File
              </button>
              <button
                className={`${styles.inputButton} ${state.source === 'webcam' ? styles.active : ''}`}
                onClick={onStartWebcam}
                title="Start webcam"
              >
                <span className={styles.inputButtonIcon}>
                  <Camera size={16} />
                </span>
                Webcam
              </button>
              {state.source !== 'none' && (
                <button className={`${styles.inputButton}`} onClick={onStopSource} title="Stop source" style={{gridColumn: '1 / -1'}}>
                  <span className={styles.inputButtonIcon}>
                    <ImageIcon size={16} />
                  </span>
                  Stop
                </button>
              )}
            </div>
          </Section>

          {/* ── Display ── */}
          <Section title="Display" icon={<Monitor size={16} />}>
            <Slider
              id="width-slider"
              label="Width"
              value={state.width}
              min={40}
              max={300}
              step={5}
              onChange={(v) => dispatch({ type: 'SET_WIDTH', payload: v })}
              formatValue={(v) => `${v} chars`}
            />
            <Slider
              id="fontsize-slider"
              label="Font Size"
              value={state.fontSize}
              min={4}
              max={20}
              step={1}
              onChange={(v) => dispatch({ type: 'SET_FONT_SIZE', payload: v })}
              formatValue={(v) => `${v}px`}
            />
            <Slider
              id="linespacing-slider"
              label="Line Spacing"
              value={state.lineSpacing}
              min={0.5}
              max={1.5}
              step={0.05}
              onChange={(v) => dispatch({ type: 'SET_LINE_SPACING', payload: v })}
              formatValue={(v) => v.toFixed(2)}
            />
          </Section>

          {/* ── Processing ── */}
          <Section title="Processing" icon={<Settings size={16} />}>
            <Slider
              id="brightness-slider"
              label="Brightness"
              value={state.brightness}
              min={0.5}
              max={2.0}
              step={0.05}
              onChange={(v) => dispatch({ type: 'SET_BRIGHTNESS', payload: v })}
              formatValue={(v) => `×${v.toFixed(2)}`}
            />
            <Slider
              id="contrast-slider"
              label="Contrast"
              value={state.contrast}
              min={0.5}
              max={3.0}
              step={0.05}
              onChange={(v) => dispatch({ type: 'SET_CONTRAST', payload: v })}
              formatValue={(v) => `×${v.toFixed(2)}`}
            />
            {state.renderMode === 'edge' && (
              <Slider
                id="edge-threshold-slider"
                label="Edge Threshold"
                value={state.edgeThreshold}
                min={20}
                max={200}
                step={5}
                onChange={(v) => dispatch({ type: 'SET_EDGE_THRESHOLD', payload: v })}
              />
            )}
          </Section>

          {/* ── Render Mode ── */}
          <Section title="Render Mode" icon={<Eye size={16} />}>
            <div className={styles.modeGrid}>
              {renderModes.map((mode) => (
                <button
                  key={mode.value}
                  className={`${styles.modeButton} ${state.renderMode === mode.value ? styles.active : ''}`}
                  onClick={() => dispatch({ type: 'SET_RENDER_MODE', payload: mode.value })}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </Section>

          {/* ── Character Set ── */}
          <Section title="Character Set" icon={<Type size={16} />}>
            <Select
              id="charset-select"
              label="Character Ramp"
              value={state.charset}
              options={getCharsetOptions()}
              onChange={(v) => dispatch({ type: 'SET_CHARSET', payload: v as CharsetName })}
            />
          </Section>

          {/* ── ASCII Art Color ── */}
          <Section title="ASCII Color" icon={<Palette size={16} />}>
            <div className={styles.themeGrid}>
              {themes.map((t) => (
                <button
                  key={t.value}
                  className={`${styles.themeButton} ${theme === t.value ? styles.active : ''}`}
                  onClick={() => setTheme(t.value)}
                  title={t.label}
                >
                  <span className={styles.themePreview} style={{ background: t.color }} />
                  {t.label}
                </button>
              ))}
              <div className={`${styles.customColorContainer} ${theme === 'custom' ? styles.customActive : ''}`}>
                <label htmlFor="ascii-color-input" className={styles.customColorLabel}>
                  Custom
                </label>
                <input
                  id="ascii-color-input"
                  type="color"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    setTheme('custom');
                  }}
                  className={styles.colorInput}
                  title="Pick custom ASCII art color"
                />
              </div>
            </div>
          </Section>

          {/* ── Reset ── */}
          <Section title="Reset" icon={<RotateCcw size={16} />} defaultOpen={false}>
            <Button
              variant="ghost"
              full
              icon={<RotateCcw size={14} />}
              onClick={() => dispatch({ type: 'RESET' })}
            >
              Reset All Settings
            </Button>
          </Section>
        </SidebarContent>
        <button className={styles.mobileClose} onClick={onClose} aria-label="Close sidebar">
          ✕
        </button>
      </Sidebar>
    </div>
  );
}
