// 禁用所有控制台日志的辅助函数
const disabledConsole = {
  log: function() {},
  error: function() {},
  warn: function() {},
  info: function() {},
  debug: function() {}
};

const checkBlacklisted = (domain, blacklists) => {
  if (!domain || !blacklists || !Array.isArray(blacklists)) {
    return false;
  }

  const normalizedDomain = domain.toLowerCase().trim();

  for (let pattern of blacklists) {
    if (!pattern || typeof pattern !== 'string') {
      continue;
    }

    const normalizedPattern = pattern.toLowerCase().trim();

    if (normalizedPattern.includes('*')) {
      const regexPattern = normalizedPattern
        .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '.*');

      const regex = new RegExp(`^${regexPattern}$`);
      if (regex.test(normalizedDomain)) {
        return true;
      }
    } else {
      const escapedPattern = normalizedPattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
      const subdomainRegex = new RegExp(`(^|\\.)${escapedPattern}$`);

      if (subdomainRegex.test(normalizedDomain)) {
        return true;
      }
    }
  }

  return false;
}

// 导出禁用的控制台对象
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    disabledConsole,
    checkBlacklisted
  };
} else {
  // 在浏览器环境中使用
  // 替换全局console对象的方法
  function disableConsoleLogging() {
    window.console.originalLog = window.console.log;
    window.console.originalError = window.console.error;
    window.console.originalWarn = window.console.warn;
    window.console.originalInfo = window.console.info;
    window.console.originalDebug = window.console.debug;

    window.console.log = function() {};
    window.console.error = function() {};
    window.console.warn = function() {};
    window.console.info = function() {};
    window.console.debug = function() {};
  }

  // 如果需要恢复控制台日志的功能（仅用于调试）
  function enableConsoleLogging() {
    if (window.console.originalLog) {
      window.console.log = window.console.originalLog;
    }
    if (window.console.originalError) {
      window.console.error = window.console.originalError;
    }
    if (window.console.originalWarn) {
      window.console.warn = window.console.originalWarn;
    }
    if (window.console.originalInfo) {
      window.console.info = window.console.originalInfo;
    }
    if (window.console.originalDebug) {
      window.console.debug = window.console.originalDebug;
    }
  }
}
