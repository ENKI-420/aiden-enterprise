        {/* Enhanced Controls with contextual help */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <div className="relative group">
          <Button onClick={() => setArEnabled(v => !v)} aria-label="Toggle AR overlay" tabIndex={0} data-tour="ar-overlay">
            {arEnabled ? 'Disable AR Overlay' : 'Enable AR Overlay'}
          </Button>
          <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition z-50">
            {welcomeCompleted ? 'AR overlay for enhanced visualization' : 'Toggle AR overlay'}
          </span>
        </div>

        <div className="relative group">
          <Button onClick={handleTranslate} aria-label="Translate transcript" tabIndex={0} data-tour="translate">Translate</Button>
          <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition z-50">
            {welcomeCompleted ? 'AI-powered real-time translation' : 'Translate transcript'}
          </span>
        </div>

        <div className="relative group">
          <Button onClick={() => exportPDF()} aria-label="Export as PDF" tabIndex={0} data-tour="export-pdf">Export Summary</Button>
          <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition z-50">
            {welcomeCompleted ? 'Generate comprehensive session summary' : 'Export as PDF'}
          </span>
        </div>

        <div className="relative group">
          <Button onClick={handleQa} aria-label="Ask AI about meeting" tabIndex={0} data-tour="ai-qa">Q&amp;A</Button>
          <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition z-50">
            {welcomeCompleted ? 'Intelligent Q&A with contextual insights' : 'Ask AI about meeting'}
          </span>
        </div>

        <div className="relative group">
          <Button onClick={handleStartVideo} aria-label="Toggle camera" tabIndex={0} data-tour="video-controls">
            {videoEnabled ? 'Stop Video' : 'Start Video'}
          </Button>
          <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition z-50">
            {welcomeCompleted ? 'HD video with AI background processing' : 'Toggle camera'}
          </span>
        </div>

        <div className="relative group">
          <Button onClick={handleShareScreen} aria-label="Share your screen" tabIndex={0} data-tour="screen-share">
            {screenEnabled ? 'Stop Sharing' : 'Share Screen'}
          </Button>
          <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition z-50">
            {welcomeCompleted ? 'Smart screen sharing with content recognition' : 'Share your screen'}
          </span>
        </div>

        <div className="relative group">
          <Button onClick={() => connect()} disabled={isConnected} aria-label="Join Conference" tabIndex={0} data-tour="join-conference">
            {isConnected ? 'Connected' : 'Join Conference'}
          </Button>
          <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition z-50">
            {welcomeCompleted ? 'Enterprise-grade secure conferencing' : 'Join the LiveKit conference'}
          </span>
        </div>

        <div className="relative group">
          <AgentWorkflowButton
            onWorkflowComplete={(results) => {
              console.log('Workflow completed:', results);
              // Could update transcript or show results in UI
            }}
          />
          <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition z-50">
            {welcomeCompleted ? 'Advanced AI agent orchestration workflows' : 'Run AI analysis workflows'}
          </span>
        </div>

        <div className="relative group">
          <Button onClick={() => window.open('/ai-coding-suite', '_blank')} aria-label="AI Coding Suite" tabIndex={0} data-tour="ai-coding-suite">
            AI Coding Suite
          </Button>
          <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition z-50">
            {welcomeCompleted ? 'Full-featured AI development environment' : 'Open AI Coding Suite'}
          </span>
        </div>

        {/* Re-trigger welcome button for returning users */}
        {welcomeCompleted && (
          <div className="relative group">
            <Button
              onClick={() => setShowPersonalizedWelcome(true)}
              variant="outline"
              aria-label="Show welcome tour again"
              className="border-blue-500 text-blue-500 hover:bg-blue-50"
              data-tour="welcome-tour"
            >
              🎯 Tour
            </Button>
            <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition z-50">
              Restart personalized welcome experience
            </span>
          </div>
        )}
      </div>