import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  withGradient?: boolean;
  alignment?: 'left' | 'center';
  divider?: boolean;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  withGradient = true,
  alignment = 'center',
  divider = true
}) => {
  const formatTitle = () => {
    if (!withGradient) return <span className="font-light">{title}</span>;

    const words = title.split(' ');
    const middleIndex = Math.floor(words.length / 2);
    
    return (
      <>
        <span className="font-light">{words.slice(0, middleIndex).join(' ')} </span>
        <span className="text-fmv-orange font-medium">{words[middleIndex]} </span>
        {words.length > middleIndex + 1 && (
          <span className="font-light">{words.slice(middleIndex + 1).join(' ')}</span>
        )}
      </>
    );
  };

  return (
    <div className={`text-${alignment} mb-12`}>
      <h2 className="section-title">
        {formatTitle()}
      </h2>
      {divider && <div className="section-divider"></div>}
      {subtitle && (
        <p className="text-xl text-fmv-silk/80 max-w-3xl mx-auto font-light">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;