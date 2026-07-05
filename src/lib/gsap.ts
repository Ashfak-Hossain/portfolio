/**
 * Single GSAP entry point. Registers plugins exactly once and re-exports the
 * pieces the app uses, so no other module has to know about registration.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, useGSAP);

export { gsap, ScrollTrigger, useGSAP };
