// PDF renderer for personalized coloring books.
// Uses @react-pdf/renderer (pure JS, no chrome dependency).

import React from 'react';
import {
  Document,
  Page,
  Text,
  Image,
  StyleSheet,
  View,
  renderToBuffer,
} from '@react-pdf/renderer';
import type { Book } from './bookStore';
import { getThemeLabel } from './templates';

const styles = StyleSheet.create({
  cover: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
  },
  coverTitle: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 700,
  },
  coverSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    color: '#555555',
  },
  coverImage: {
    width: '85%',
    objectFit: 'contain',
    marginBottom: 24,
  },
  coverFooter: {
    fontSize: 10,
    color: '#999999',
    marginTop: 16,
  },
  storyPage: {
    flexDirection: 'column',
    padding: 32,
    backgroundColor: '#FFFFFF',
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    fontSize: 9,
    color: '#999999',
  },
  pageText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 1.4,
  },
  pageImage: {
    flex: 1,
    objectFit: 'contain',
    width: '100%',
  },
  pageFooter: {
    marginTop: 12,
    fontSize: 9,
    color: '#bbbbbb',
    textAlign: 'center',
  },
});

function BookDocument({ book }: { book: Book }) {
  return (
    <Document
      title={`${book.childName}'s Coloring Book`}
      author="Magick Coloring"
      subject={getThemeLabel(book.theme)}
    >
      <Page size="LETTER" style={styles.cover}>
        <Text style={styles.coverTitle}>{book.childName}'s Coloring Book</Text>
        <Text style={styles.coverSubtitle}>{getThemeLabel(book.theme)}</Text>
        {book.coverImageUrl && (
          // eslint-disable-next-line jsx-a11y/alt-text
          <Image style={styles.coverImage} src={book.coverImageUrl} />
        )}
        <Text style={styles.coverFooter}>
          Made with love at magickcoloring.com
        </Text>
      </Page>

      {book.story.map((page, i) => {
        const imageUrl = book.pageImageUrls[i];
        return (
          <Page key={page.pageNumber} size="LETTER" style={styles.storyPage}>
            <View style={styles.pageHeader}>
              <Text>{book.childName}</Text>
              <Text>Page {page.pageNumber}</Text>
            </View>
            <Text style={styles.pageText}>{page.text}</Text>
            {imageUrl ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image style={styles.pageImage} src={imageUrl} />
            ) : (
              <View style={{ flex: 1 }} />
            )}
            <Text style={styles.pageFooter}>magickcoloring.com</Text>
          </Page>
        );
      })}
    </Document>
  );
}

export async function renderBookPdf(book: Book): Promise<Buffer> {
  return renderToBuffer(<BookDocument book={book} />);
}
