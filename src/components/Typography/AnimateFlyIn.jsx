import React from 'react';

/**
 *
 * @param {{
 * animationDelayMs: Number,
 * animationDurationMsTotal: Number
 * }} props Props
 *
 * @param { Number } animationDurationMsTotal Total time in ms the animation should finish in (not including the delay)
 * @param { Number } animationDelayMs Animation delay in ms
 * @returns
 */
export default function AnimateFlowInText({
  animationDelayMs = 0,
  animationDurationMsTotal = 1000,
  children,
  ...props
}) {
  const textContent = children.props.children;

  if (typeof textContent !== 'string') {
    console.error('Child element should only have a string as its child');
    return null;
  }

  const textContentArray = textContent.split(' ');
  const animationIntervalMs =
    animationDurationMsTotal / textContentArray.length;

  return (
    <span {...props} aria-label={textContent}>
      {textContentArray.map((text, index) => {
        return React.createElement(
          children.type,
          {
            key: index,
            ...children.props,
            className: 'flowInText',
            style: {
              animationDelay: `${
                index * animationIntervalMs + animationDelayMs
              }ms`,
              ...children.props.style,
            },
          },
          index < textContentArray.length ? `${text} ` : text
        );
      })}
    </span>
  );
}
