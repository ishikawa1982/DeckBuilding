import { useState } from 'react'
import { audio } from '../audio/engine'

interface Props {
  corner?: boolean
}

export function SoundToggle({ corner }: Props) {
  const [muted, setMuted] = useState(() => audio.isMuted())
  return (
    <button
      className={`btn btn-small${corner ? ' sound-toggle-corner' : ''}`}
      onClick={() => setMuted(audio.toggleMuted())}
      aria-label={muted ? 'サウンドをONにする' : 'サウンドをOFFにする'}
    >
      {muted ? '♪╳' : '♪'}
    </button>
  )
}
