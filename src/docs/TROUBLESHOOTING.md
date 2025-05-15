# Troubleshooting Common Issues

## React Native Paper Surface Component

### Warning: "When setting overflow to hidden on Surface the shadow will not be displayed correctly"

This warning occurs when you apply `overflow: 'hidden'` directly to a `Surface` component. The shadow effect requires the component to render outside its boundaries, but `overflow: 'hidden'` prevents this.

#### Solution

Always wrap the content of your `Surface` component in a separate `View` with the `overflow: 'hidden'` style:

```jsx
// ❌ Incorrect - Applies overflow directly to Surface
<Surface style={{ overflow: 'hidden', borderRadius: 8 }}>
  {/* content */}
</Surface>

// ✅ Correct - Applies overflow to a child View
<Surface style={{ borderRadius: 8 }}>
  <View style={{ overflow: 'hidden' }}>
    {/* content */}
  </View>
</Surface>
```

#### Using the SafeSurface Component

For convenience, we've created a `SafeSurface` component that handles this pattern for you:

```jsx
import { SafeSurface } from '../utils/componentUtils';

// Use this component instead of Surface when you need overflow: 'hidden'
<SafeSurface 
  style={{ borderRadius: 8 }} 
  contentStyle={{ overflow: 'hidden' }}
  elevation={1}
>
  {/* content */}
</SafeSurface>
```

#### Migrating Existing Code

When fixing this warning:

1. Identify components using `Surface` with `overflow: 'hidden'`
2. Either wrap the content in a separate `View` with overflow or use the `SafeSurface` component
3. Make sure the `borderRadius` values match between both components 