import { Tool, Category } from './toolTypes';
import { HashGenerator } from './tools/HashGenerator';
import { BcryptTool } from './tools/BcryptTool';
import { HmacGenerator } from './tools/HmacGenerator';
import { EncryptionTool } from './tools/EncryptionTool';
import { JwtParserTool } from './tools/JwtParserTool';
import { UuidGenerator } from './tools/UuidGenerator';
import { UlidGenerator } from './tools/UlidGenerator';
import { BasicAuthGenerator } from './tools/BasicAuthGenerator';
import { Base64StringConverter } from './tools/Base64StringConverter';
import { Base64FileConverter } from './tools/Base64FileConverter';
import { DateTimeConverter } from './tools/DateTimeConverter';
import { CaseConverter } from './tools/CaseConverter';
import { ColorConverter } from './tools/ColorConverter';
import { IntegerBaseConverter } from './tools/IntegerBaseConverter';
import { UrlEncoder } from './tools/UrlEncoder';
import { UrlParser } from './tools/UrlParser';
import { Ipv4SubnetCalculator } from './tools/Ipv4SubnetCalculator';
import { HttpStatusCode } from './tools/HttpStatusCode';
import { QrCodeGenerator } from './tools/QrCodeGenerator';
import { DeviceInformation } from './tools/DeviceInformation';
import { LoremIpsumGenerator } from './tools/LoremIpsumGenerator';
import { TextStatistics } from './tools/TextStatistics';
import { SlugifyTool } from './tools/SlugifyTool';
import { HtmlEntitiesTool } from './tools/HtmlEntitiesTool';
import { JsonFormatter } from './tools/JsonFormatter';
import { SqlFormatterTool } from './tools/SqlFormatterTool';
import { XmlFormatterTool } from './tools/XmlFormatterTool';
import { MathEvaluator } from './tools/MathEvaluator';
import { PercentageCalculator } from './tools/PercentageCalculator';
import { CrontabGenerator } from './tools/CrontabGenerator';
import { ChmodCalculator } from './tools/ChmodCalculator';
import { GitMemo } from './tools/GitMemo';
import { RegexMemo } from './tools/RegexMemo';
import { KeycodeInfo } from './tools/KeycodeInfo';

export const CATEGORIES: Category[] = [
  {
    id: 'crypto',
    name: 'Crypto & Security',
    description: 'Hash, encryption, token generation and security tools',
    icon: 'Shield',
  },
  {
    id: 'converter',
    name: 'Converters',
    description: 'Data format, date, base and unit transformation utilities',
    icon: 'Repeat',
  },
  {
    id: 'web',
    name: 'Web & Network',
    description: 'URL, networking, QR code and browser utilities',
    icon: 'Globe',
  },
  {
    id: 'text',
    name: 'Text & Strings',
    description: 'String manipulation, statistics, and text generation',
    icon: 'Type',
  },
  {
    id: 'formatter',
    name: 'Formatters',
    description: 'Code, JSON, SQL, and XML prettification and validation',
    icon: 'Code',
  },
  {
    id: 'math',
    name: 'Math & Dev Tools',
    description: 'Calculators, crontab, chmod, and logic tools',
    icon: 'Calculator',
  },
  {
    id: 'memo',
    name: 'Cheatsheets & Memos',
    description: 'Quick reference sheets for Git, Regex, and Keyboard events',
    icon: 'BookOpen',
  },
];

export const TOOLS: Tool[] = [
  // Crypto
  {
    id: 'hash-generator',
    title: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes from input string',
    category: 'crypto',
    keywords: ['md5', 'sha1', 'sha256', 'sha512', 'hash', 'digest', 'crypto'],
    icon: 'Hash',
    component: HashGenerator,
  },
  {
    id: 'bcrypt-tool',
    title: 'Bcrypt Hash & Verify',
    description: 'Generate and compare passwords with salted Bcrypt hashes',
    category: 'crypto',
    keywords: ['bcrypt', 'password', 'salt', 'security', 'hash', 'verify'],
    icon: 'Lock',
    component: BcryptTool,
  },
  {
    id: 'hmac-generator',
    title: 'HMAC Generator',
    description: 'Keyed-hash message authentication code generator',
    category: 'crypto',
    keywords: ['hmac', 'secret', 'sha256', 'signature', 'authentication'],
    icon: 'Key',
    component: HmacGenerator,
  },
  {
    id: 'encryption-tool',
    title: 'Encryption / Decryption',
    description: 'Encrypt and decrypt text with AES, TripleDES, RC4 or Rabbit',
    category: 'crypto',
    keywords: ['aes', 'encrypt', 'decrypt', 'cipher', 'secret', 'des'],
    icon: 'ShieldAlert',
    component: EncryptionTool,
  },
  {
    id: 'jwt-parser',
    title: 'JWT Token Parser',
    description: 'Decode, inspect payload, header, and check expiration of JSON Web Tokens',
    category: 'crypto',
    keywords: ['jwt', 'json web token', 'decode', 'bearer', 'auth', 'token'],
    icon: 'KeyRound',
    component: JwtParserTool,
  },
  {
    id: 'uuid-generator',
    title: 'UUID Generator',
    description: 'Batch generate Version 1 and Version 4 Universally Unique Identifiers',
    category: 'crypto',
    keywords: ['uuid', 'v4', 'v1', 'guid', 'identifier', 'unique'],
    icon: 'Fingerprint',
    component: UuidGenerator,
  },
  {
    id: 'ulid-generator',
    title: 'ULID Generator',
    description: 'Universally Unique Lexicographically Sortable Identifier generator',
    category: 'crypto',
    keywords: ['ulid', 'sortable', 'timestamp', 'identifier'],
    icon: 'ListOrdered',
    component: UlidGenerator,
  },
  {
    id: 'basic-auth',
    title: 'Basic Auth Generator',
    description: 'Generate HTTP Basic Authentication headers from username and password',
    category: 'crypto',
    keywords: ['basic auth', 'http', 'header', 'authorization', 'base64'],
    icon: 'UserCheck',
    component: BasicAuthGenerator,
  },

  // Converters
  {
    id: 'base64-string',
    title: 'Base64 String Converter',
    description: 'Encode plain text to Base64 or decode Base64 string to plain text',
    category: 'converter',
    keywords: ['base64', 'encode', 'decode', 'string', 'url-safe'],
    icon: 'Binary',
    component: Base64StringConverter,
  },
  {
    id: 'base64-file',
    title: 'Base64 File Converter',
    description: 'Convert images, documents or files into Base64 Data URI strings',
    category: 'converter',
    keywords: ['base64', 'file', 'image', 'data uri', 'upload'],
    icon: 'FileCode',
    component: Base64FileConverter,
  },
  {
    id: 'datetime-converter',
    title: 'Date-Time & Epoch Converter',
    description: 'Convert Unix epoch timestamps to ISO, UTC, local date strings and vice versa',
    category: 'converter',
    keywords: ['timestamp', 'epoch', 'unix', 'date', 'time', 'iso8601', 'utc'],
    icon: 'Calendar',
    component: DateTimeConverter,
  },
  {
    id: 'case-converter',
    title: 'Case Converter',
    description: 'Transform string case between camelCase, snake_case, kebab-case, PascalCase, CONSTANT_CASE',
    category: 'converter',
    keywords: ['camelCase', 'snake_case', 'kebab-case', 'pascalCase', 'string', 'case'],
    icon: 'Baseline',
    component: CaseConverter,
  },
  {
    id: 'color-converter',
    title: 'Color Converter',
    description: 'Convert between HEX, RGB, HSL, HSV, CMYK with color preview',
    category: 'converter',
    keywords: ['color', 'hex', 'rgb', 'hsl', 'cmyk', 'picker', 'palette'],
    icon: 'Palette',
    component: ColorConverter,
  },
  {
    id: 'integer-base',
    title: 'Integer Base Converter',
    description: 'Convert numbers between Binary, Octal, Decimal, Hexadecimal and Base36',
    category: 'converter',
    keywords: ['binary', 'hex', 'octal', 'decimal', 'base16', 'base2', 'radix'],
    icon: 'Calculator',
    component: IntegerBaseConverter,
  },

  // Web & Network
  {
    id: 'url-encoder',
    title: 'URL Encoder / Decoder',
    description: 'Encode or decode URLs and URI components',
    category: 'web',
    keywords: ['url', 'uri', 'percent encoding', 'encode', 'decode', 'escape'],
    icon: 'Link',
    component: UrlEncoder,
  },
  {
    id: 'url-parser',
    title: 'URL Parser',
    description: 'Parse URL into protocol, hostname, port, pathname and query parameters',
    category: 'web',
    keywords: ['url', 'hostname', 'domain', 'query param', 'searchParams'],
    icon: 'Compass',
    component: UrlParser,
  },
  {
    id: 'ipv4-subnet',
    title: 'IPv4 Subnet Calculator',
    description: 'Calculate subnet mask, network IP, broadcast IP, usable host range from CIDR',
    category: 'web',
    keywords: ['ipv4', 'subnet', 'cidr', 'mask', 'network', 'ip', 'broadcast'],
    icon: 'Network',
    component: Ipv4SubnetCalculator,
  },
  {
    id: 'http-status',
    title: 'HTTP Status Codes',
    description: 'Complete searchable reference guide of HTTP status codes and descriptions',
    category: 'web',
    keywords: ['http', 'status code', '404', '500', '200', 'rest', 'api'],
    icon: 'FileQuestion',
    component: HttpStatusCode,
  },
  {
    id: 'qr-code',
    title: 'QR Code Generator',
    description: 'Generate downloadable QR codes for text, URLs or contact info',
    category: 'web',
    keywords: ['qr code', 'barcode', 'generator', 'url', 'png'],
    icon: 'QrCode',
    component: QrCodeGenerator,
  },
  {
    id: 'device-info',
    title: 'Device & Browser Info',
    description: 'Inspect live browser specifications, screen metrics, OS and User Agent details',
    category: 'web',
    keywords: ['device', 'browser', 'user agent', 'screen', 'resolution', 'specs'],
    icon: 'Laptop',
    component: DeviceInformation,
  },

  // Text & Strings
  {
    id: 'lorem-ipsum',
    title: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text by paragraphs, sentences or words',
    category: 'text',
    keywords: ['lorem', 'ipsum', 'placeholder', 'dummy text', 'paragraphs'],
    icon: 'FileText',
    component: LoremIpsumGenerator,
  },
  {
    id: 'text-statistics',
    title: 'Text Statistics & Counter',
    description: 'Count characters, words, sentences, lines, byte sizes and reading time',
    category: 'text',
    keywords: ['word count', 'character count', 'bytes', 'reading time', 'stats'],
    icon: 'BarChart2',
    component: TextStatistics,
  },
  {
    id: 'slugify',
    title: 'String Slugifier',
    description: 'Convert titles and strings into clean, SEO-friendly URL slugs',
    category: 'text',
    keywords: ['slug', 'slugify', 'url', 'seo', 'title'],
    icon: 'Sparkles',
    component: SlugifyTool,
  },
  {
    id: 'html-entities',
    title: 'HTML Entities Encoder',
    description: 'Encode special characters into HTML entities or decode entities to text',
    category: 'text',
    keywords: ['html', 'entities', 'escape', 'unescape', 'special chars'],
    icon: 'Code2',
    component: HtmlEntitiesTool,
  },

  // Formatters
  {
    id: 'json-formatter',
    title: 'JSON Prettify & Minify',
    description: 'Format, validate, prettify or minify JSON strings with custom indentation',
    category: 'formatter',
    keywords: ['json', 'format', 'prettify', 'minify', 'validate', 'parser'],
    icon: 'Braces',
    component: JsonFormatter,
  },
  {
    id: 'sql-formatter',
    title: 'SQL Query Prettifier',
    description: 'Format and beautify SQL queries across MySQL, PostgreSQL, SQLite, T-SQL',
    category: 'formatter',
    keywords: ['sql', 'query', 'format', 'prettify', 'mysql', 'postgresql'],
    icon: 'Database',
    component: SqlFormatterTool,
  },
  {
    id: 'xml-formatter',
    title: 'XML Formatter',
    description: 'Format and prettify XML strings with proper indentation',
    category: 'formatter',
    keywords: ['xml', 'format', 'prettify', 'indent', 'soap'],
    icon: 'FileCode2',
    component: XmlFormatterTool,
  },

  // Math & Dev
  {
    id: 'math-evaluator',
    title: 'Math Expression Evaluator',
    description: 'Evaluate mathematical formulas, trigonometric functions and unit conversions',
    category: 'math',
    keywords: ['math', 'calculator', 'eval', 'formula', 'algebra', 'trig'],
    icon: 'Calculator',
    component: MathEvaluator,
  },
  {
    id: 'percentage-calculator',
    title: 'Percentage Calculator',
    description: 'Calculate percentage of values, ratio percentages, and percentage change',
    category: 'math',
    keywords: ['percent', 'percentage', 'discount', 'increase', 'math'],
    icon: 'Percent',
    component: PercentageCalculator,
  },
  {
    id: 'crontab-generator',
    title: 'Crontab Expression Generator',
    description: 'Build and validate cron schedule expressions with human readable explanations',
    category: 'math',
    keywords: ['cron', 'crontab', 'schedule', 'timer', 'cronstrue'],
    icon: 'Clock',
    component: CrontabGenerator,
  },
  {
    id: 'chmod-calculator',
    title: 'Chmod Permission Calculator',
    description: 'Calculate Linux/Unix file permissions in octal (755) and symbolic (rwxr-xr-x)',
    category: 'math',
    keywords: ['chmod', 'permissions', 'linux', 'unix', 'octal', 'rwxr-xr-x'],
    icon: 'Terminal',
    component: ChmodCalculator,
  },

  // Memos
  {
    id: 'git-memo',
    title: 'Git Cheatsheet',
    description: 'Searchable reference sheet for common Git version control commands',
    category: 'memo',
    keywords: ['git', 'cheatsheet', 'commit', 'branch', 'push', 'pull', 'reset'],
    icon: 'GitBranch',
    component: GitMemo,
  },
  {
    id: 'regex-memo',
    title: 'Regex Cheatsheet & Tester',
    description: 'Quick reference guide and live testing tool for regular expressions',
    category: 'memo',
    keywords: ['regex', 'regexp', 'match', 'pattern', 'cheatsheet', 'test'],
    icon: 'Regex',
    component: RegexMemo,
  },
  {
    id: 'keycode-info',
    title: 'Keycode Event Inspector',
    description: 'Press any key on keyboard to view JavaScript KeyboardEvent codes and properties',
    category: 'memo',
    keywords: ['keycode', 'keyboard', 'event', 'key', 'code', 'listener'],
    icon: 'Keyboard',
    component: KeycodeInfo,
  },
];
