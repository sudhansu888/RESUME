import React from 'react';
import { Document, Page, Text, View, Link, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    paddingTop: 26,
    paddingBottom: 26,
    paddingHorizontal: 30,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#0f172a',
    backgroundColor: '#ffffff',
    lineHeight: 1.35,
  },
  header: {
    marginBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: '#0f172a',
    paddingBottom: 5,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  candidateName: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#020617',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  candidateTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#1d4ed8',
    marginTop: 1,
  },
  contactBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
    fontSize: 8,
    color: '#475569',
  },
  contactLink: {
    color: '#1d4ed8',
    textDecoration: 'none',
  },
  section: {
    marginTop: 6,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#0f172a',
    borderBottomWidth: 0.8,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 2,
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 8.5,
    color: '#334155',
    lineHeight: 1.35,
    textAlign: 'justify',
  },
  skillCategory: {
    marginBottom: 2.5,
  },
  skillCategoryTitle: {
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    fontSize: 8.5,
  },
  skillListText: {
    color: '#334155',
    fontSize: 8.5,
  },
  itemBlock: {
    marginBottom: 5,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 1,
  },
  itemTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.8,
    color: '#0f172a',
  },
  itemSubtitle: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 8,
    color: '#475569',
  },
  itemPeriod: {
    fontFamily: 'Helvetica',
    fontSize: 8,
    color: '#64748b',
  },
  bulletPoint: {
    flexDirection: 'row',
    marginTop: 1.5,
    paddingLeft: 4,
  },
  bulletDot: {
    width: 8,
    fontSize: 8.5,
    color: '#1d4ed8',
  },
  bulletText: {
    flex: 1,
    fontSize: 8.3,
    color: '#334155',
    lineHeight: 1.3,
  },
  projectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  projectCard: {
    width: '49%',
    padding: 4.5,
    marginBottom: 4.5,
    borderWidth: 0.5,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    borderRadius: 2,
  },
  projectTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.5,
    color: '#0f172a',
    marginBottom: 1,
  },
  projectCategory: {
    fontSize: 7.2,
    color: '#1d4ed8',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 1.5,
  },
  projectTagline: {
    fontSize: 7.5,
    color: '#475569',
    marginBottom: 2,
    lineHeight: 1.25,
  },
  projectTech: {
    fontSize: 7,
    color: '#64748b',
  },
  twoColSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  halfCol: {
    width: '48%',
  },
});

export default function ResumePdfDocument({ resume }) {
  if (!resume || !resume.profile) return null;
  const {
    profile,
    skills = [],
    experience = [],
    projects = [],
    education = [],
    certifications = [],
    achievements = [],
    customSections = [],
    sectionsVisibility = {},
  } = resume;

  const isVisible = (key) => sectionsVisibility[key] !== false;

  return (
    <Document
      title={`${profile.name || 'Candidate'} - Resume`}
      author={profile.name || 'Candidate'}
      subject="Curriculum Vitae"
      keywords="Software Engineer, Full-Stack, WebGL, 3D, Systems, React, Node.js"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.candidateName}>{profile.name}</Text>
              <Text style={styles.candidateTitle}>{profile.title}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              {profile.location && (
                <Text style={{ fontSize: 8, color: '#475569' }}>{profile.location}</Text>
              )}
              {profile.email && (
                <Link src={`mailto:${profile.email}`} style={[styles.contactLink, { fontSize: 8 }]}>
                  {profile.email}
                </Link>
              )}
              {profile.phone && (
                <Text style={{ fontSize: 7.5, color: '#64748b' }}>{profile.phone}</Text>
              )}
            </View>
          </View>

          {/* Social Links Bar */}
          <View style={styles.contactBar}>
            {profile.github && (
              <Text>GitHub: <Link src={profile.github} style={styles.contactLink}>{profile.github.replace('https://', '')}</Link></Text>
            )}
            {profile.linkedin && (
              <>
                <Text>•</Text>
                <Text>LinkedIn: <Link src={profile.linkedin} style={styles.contactLink}>{profile.linkedin.replace('https://', '')}</Link></Text>
              </>
            )}
            {profile.website && (
              <>
                <Text>•</Text>
                <Text>Portfolio: <Link src={profile.website} style={styles.contactLink}>{profile.website.replace('https://', '')}</Link></Text>
              </>
            )}
          </View>
        </View>

        {/* Professional Summary */}
        {isVisible('about') && (profile.summary || profile.bio) && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{profile.summary || profile.bio}</Text>
          </View>
        )}

        {/* Technical Skills */}
        {isVisible('skills') && skills.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Technical Competencies</Text>
            {skills.map((skillGroup, idx) => (
              <View key={idx} style={styles.skillCategory}>
                <Text>
                  <Text style={styles.skillCategoryTitle}>{skillGroup.category}: </Text>
                  <Text style={styles.skillListText}>
                    {skillGroup.items?.map(i => i.name).join(', ')}
                  </Text>
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Professional Experience */}
        {isVisible('experience') && experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {experience.map((exp, idx) => (
              <View key={idx} style={styles.itemBlock} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text>
                    <Text style={styles.itemTitle}>{exp.role}</Text>
                    <Text style={styles.itemSubtitle}> — {exp.company}</Text>
                  </Text>
                  <Text style={styles.itemPeriod}>{exp.period} | {exp.location}</Text>
                </View>
                {exp.description && (
                  <Text style={{ fontSize: 7.8, color: '#475569', fontStyle: 'italic', marginBottom: 2 }}>
                    {exp.description}
                  </Text>
                )}
                {exp.achievements && exp.achievements.map((ach, i) => (
                  <View key={i} style={styles.bulletPoint}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{ach}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Selected Production Projects */}
        {isVisible('projects') && projects.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Selected Production Projects</Text>
            <View style={styles.projectGrid}>
              {projects.slice(0, 4).map((proj) => (
                <View key={proj.id} style={styles.projectCard}>
                  <Text style={styles.projectTitle}>{proj.title}</Text>
                  <Text style={styles.projectCategory}>{proj.category}</Text>
                  <Text style={styles.projectTagline}>{proj.tagline}</Text>
                  {proj.tech && (
                    <Text style={styles.projectTech}>Tech: {proj.tech.join(', ')}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Education & Certifications (Two-Column Section) */}
        <View style={styles.twoColSection} wrap={false}>
          {isVisible('education') && education.length > 0 && (
            <View style={styles.halfCol}>
              <Text style={styles.sectionTitle}>Education</Text>
              {education.map((edu, idx) => (
                <View key={idx} style={{ marginBottom: 3 }}>
                  <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 8.3 }}>{edu.degree}</Text>
                  <Text style={{ fontSize: 7.8, color: '#475569' }}>{edu.institution} ({edu.period})</Text>
                  {edu.grade && <Text style={{ fontSize: 7.3, color: '#64748b' }}>{edu.grade}</Text>}
                </View>
              ))}
            </View>
          )}

          {isVisible('certifications') && certifications.length > 0 && (
            <View style={styles.halfCol}>
              <Text style={styles.sectionTitle}>Certifications &amp; Credentials</Text>
              {certifications.map((cert, idx) => (
                <View key={idx} style={{ flexDirection: 'row', marginBottom: 2 }}>
                  <Text style={{ width: 6, fontSize: 8, color: '#1d4ed8' }}>•</Text>
                  <Text style={{ flex: 1, fontSize: 7.8, color: '#334155' }}>
                    <Text style={{ fontFamily: 'Helvetica-Bold' }}>{cert.name}</Text> — {cert.issuer} {cert.year ? `(${cert.year})` : ''}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Honors & Achievements */}
        {isVisible('achievements') && achievements.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Honors &amp; Achievements</Text>
            {achievements.map((item, idx) => (
              <View key={idx} style={{ marginBottom: 2.5 }}>
                <Text style={{ fontSize: 8.2 }}>
                  <Text style={{ fontFamily: 'Helvetica-Bold' }}>{item.title}</Text> ({item.organization}, {item.year})
                </Text>
                {item.description && (
                  <Text style={{ fontSize: 7.8, color: '#475569' }}>{item.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Custom Sections */}
        {customSections && customSections.map((sec, idx) => {
          if (!isVisible(`custom-${idx}`)) return null;
          return (
            <View key={`custom-${idx}`} style={styles.section} wrap={false}>
              <Text style={styles.sectionTitle}>{sec.title}</Text>
              <Text style={styles.summaryText}>{sec.content}</Text>
            </View>
          );
        })}
      </Page>
    </Document>
  );
}
