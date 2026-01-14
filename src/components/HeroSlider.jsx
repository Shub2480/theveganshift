import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { heroSlides } from '../data/products';
import { getAssetUrl } from '../utils/helpers';
import './HeroSlider.css';

export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    }, []);

    const goToSlide = (index) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        // Resume auto-play after 5 seconds of inactivity
        setTimeout(() => setIsAutoPlaying(true), 5000);
    };

    // Auto-play
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextSlide, prevSlide]);

    return (
        <section className="hero-slider" aria-label="Featured products slider">
            <div className="slider-container">
                {heroSlides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`slide ${index === currentSlide ? 'active' : ''}`}
                        style={{
                            '--gradient': slide.gradient,
                            backgroundImage: `url(${getAssetUrl(slide.image)})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        {/* Background Pattern */}
                        <div className="slide-bg-pattern"></div>

                        {/* Content */}
                        <div className="container slide-content">
                            <div className="slide-text">
                                <span className="slide-subtitle animate-slide-down">
                                    {slide.subtitle}
                                </span>
                                <h1 className="slide-title animate-slide-up">
                                    {slide.title}
                                </h1>
                                <p className="slide-description animate-fade-in">
                                    {slide.description}
                                </p>
                                <Link
                                    to={slide.ctaLink}
                                    className="btn btn-primary btn-large slide-cta"
                                >
                                    {slide.cta}
                                </Link>
                            </div>

                            {/* Decorative Elements */}
                            <div className="slide-decoration">
                                <div className="decoration-circle circle-1"></div>
                                <div className="decoration-circle circle-2"></div>
                                <div className="decoration-circle circle-3"></div>
                                <div className="floating-leaf leaf-1">🌿</div>
                                <div className="floating-leaf leaf-2">🍃</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                className="slider-nav slider-nav-prev"
                onClick={prevSlide}
                aria-label="Previous slide"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                className="slider-nav slider-nav-next"
                onClick={nextSlide}
                aria-label="Next slide"
            >
                <ChevronRight size={24} />
            </button>

            {/* Dots Indicator */}
            <div className="slider-dots">
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        className={`dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Progress Bar */}
            <div className="slider-progress">
                <div
                    className="progress-bar"
                    style={{
                        animationDuration: isAutoPlaying ? '5s' : '0s',
                        animationPlayState: isAutoPlaying ? 'running' : 'paused'
                    }}
                    key={currentSlide}
                ></div>
            </div>
        </section>
    );
}
