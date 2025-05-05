import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';

// Add web-specific styles
if (Platform.OS === 'web') {
  const style = document.createElement('style');
  style.textContent = `
    html, body, #root {
      height: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
    
    body {
      background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
      background-image: 
        linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%), 
        repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.03) 0px, rgba(0, 0, 0, 0.03) 1px, transparent 1px, transparent 10px);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    
    #root {
      display: flex;
      flex-direction: column;
    }
    
    /* Device rotating instructions */
    @media (max-width: 480px) {
      #root::before {
        content: "For the best experience, please rotate your device to landscape mode";
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        padding: 10px;
        background-color: rgba(0,0,0,0.7);
        color: white;
        text-align: center;
        z-index: 9999;
        font-size: 14px;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Set the page title
  document.title = "Komuniteti Admin";
  
  // Add a favicon
  const favicon = document.createElement('link');
  favicon.rel = 'shortcut icon';
  favicon.type = 'image/png';
  favicon.href = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJgSURBVFhH7ZbLahRBFIb7JeY28zLZuBAiiExWmQdI3PkIWWQlgg8gGMxCSILgwoUbwQsILpOFEcxCEQTJYGYYJk6SSYaZSbqnL9Xtv6ZrmKrp7ukZN0IOfJyuU3Xqr75U9fQkbmBaFi/MAlWpW1nVlpfqlpycmda9atXv94tl4Wq9YaVP7BXIUmH3KHQMUPZV6R7nDyhUKpVEEAQiCAJRrVaFZVn8LVxLbDd96fRVXCWo1+vtEzQaDT5ieNG4YNwQ73ZfwFWCer3OI4dv/xrFUNFi4/eS2Cv71Eh8iDiC/AKuEhCCrDQgPJKnIk9IcB0wfnjPSKGxUlKM5vLiU/6D+JZbEn+KO7wXDsQFvxWW5yjm/ZxHnQ94GwdyGvhSzPOR2gYkGCpgK2s7m/Pjg3X8LxhXSL3qiXv9L/E2DqQbkDjWwLaBhYf9Yq/Uw3shGItC/RnOYdQb+LdLpIUPcJXA2ItHaVZ+9s9kMu/ZE60YG/jyyMXzXoDiFl4g0UBSLpfZiNvtih+Fe2Lzybz4OfulbdCDQGYUmnS8zVYV07ZzOE+G7K3u3uZttCACk5C5ZYmnHx+L6acT4un0hFjNrrKBTrpCxBrIZDK39TZaEAExUZRnhOu64vJgShQKBe6D4+Xrj/hdgBSj1Iip/w5KCIlCoVIEKdJgTSLLJ5KZTynR6/Xy9U+FRXwTohsQgOzVqRJOvnKdY/JdF4z5fJ6v3+8f+K7rrdm29SmXy+G3AGVOQVJIKtU2JHGEzE9hTa/BtY7nedFvQXoAvlCkCSkAAAAASUVORK5CYII=';
  document.head.appendChild(favicon);
}

import App from './App';

// Register the app
registerRootComponent(App); 