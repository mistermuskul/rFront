<template>
  <div class="main-page">
    <div class="background-blur"></div>
    <div class="resume-container">
      <HeroSection @update:avatar="adminAvatar = $event" />
      <AboutMe />   
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <ContactSection />
    </div>
    <AnimatedAnimals />
    <ChatWidget :admin-avatar="adminAvatar" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { AboutMe } from '../../../../entities/AboutMe/index'
import { HeroSection } from '../../../../entities/HeroSection/index'
import { SkillsSection } from '../../../../entities/SkillsSection/index'
import { ExperienceSection } from '../../../../entities/ExperienceSection/index'
import { ContactSection } from '../../../../entities/ContactSection/index'
import AnimatedAnimals from '../../../../shared/ui/AnimatedAnimals.vue'
import { ProjectsSection } from '../../../../entities/ProjectsSection/index'
import { ChatWidget } from '../../../../entities/Chat/index'

const route = useRoute()
const adminAvatar = ref('')

onMounted(() => {
  console.log('MainPage mounted')
  console.log('Route params:', route.params)
  console.log('Route path:', route.path)
  console.log('Route name:', route.name)
})
</script>

<style scoped>
.main-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #121212 100%);
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow: hidden;
}

.background-blur {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(76, 0, 255, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 80% 80%, rgba(0, 255, 200, 0.15) 0%, transparent 40%);
  filter: blur(100px);
  z-index: 0;
  pointer-events: none;
}

.resume-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 1;
}

/* Hero Section */
.hero-section {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.avatar-container {
  margin-bottom: 2rem;
}

.avatar-wrapper {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
}

.avatar-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 50%;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  z-index: -1;
  animation: glow 3s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    opacity: 0.5;
    transform: scale(1);
  }
  to {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

.name {
  font-size: 4rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(45deg, #ffffff, #a8a8a8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title {
  font-size: 2rem;
  color: #a8a8a8;
  margin: 1rem 0;
}

.bio {
  font-size: 1.2rem;
  color: #888;
  max-width: 600px;
  margin: 0 auto;
}

/* Section Styles */
section {
  margin: 4rem 0;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 2rem;
  color: #ffffff;
  margin-bottom: 2rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #ffffff, transparent);
}

/* Skills Section */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.skill-category {
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 8px;
}

.skill-category h3 {
  color: #ffffff;
  margin-bottom: 1rem;
}

.skill-category ul {
  list-style: none;
  padding: 0;
}

.skill-category li {
  color: #a8a8a8;
  margin: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
}

.skill-category li::before {
  content: '▹';
  position: absolute;
  left: 0;
  color: #ffffff;
}

/* Timeline */
.timeline {
  position: relative;
}

.timeline-item {
  margin-bottom: 2rem;
  position: relative;
  padding-left: 2rem;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #ffffff, transparent);
}

.timeline-content {
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 8px;
}

.timeline-content h3 {
  color: #ffffff;
  margin: 0 0 0.5rem 0;
}

.company {
  color: #a8a8a8;
  font-weight: 500;
  margin: 0;
}

.period {
  color: #888;
  font-size: 0.9rem;
  margin: 0.5rem 0;
}

.description {
  color: #a8a8a8;
  margin: 1rem 0 0 0;
}

/* Contact Section */
.contact-info {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.contact-item {
  color: #a8a8a8;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;
}

.contact-item:hover {
  color: #ffffff;
}

/* Responsive Design */
@media (max-width: 768px) {
  .name {
    font-size: 3rem;
  }
  
  .title {
    font-size: 1.5rem;
  }
  
  .resume-container {
    padding: 1rem;
  }
  
  section {
    padding: 1.5rem;
  }
}
</style>