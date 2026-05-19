"use client"

import { useState } from "react"
import {
  Shield,
  BookOpen,
  Award,
  AlertTriangle,
  Eye,
  Lock,
  Link2,
  CheckCircle,
  XCircle,
  Lightbulb,
  TrendingUp,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function EducationCenterPage() {
  const [quizScore, setQuizScore] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)

  const quizQuestions = [
    {
      question: "You receive a message promising 100 free Pi tokens. What should you do?",
      options: [
        "Click the link immediately to claim",
        "Ignore it - Pi Network never gives free tokens via unsolicited messages",
        "Share with friends so they can benefit too",
        "Enter your passphrase to verify",
      ],
      correct: 1,
      explanation:
        "Official Pi Network NEVER asks for your passphrase or offers free tokens through unsolicited messages. This is always a scam.",
    },
    {
      question: "Which URL is the official Pi Network website?",
      options: ["minepi.com", "mine-pi.com", "pi-network.org", "minepl.com"],
      correct: 0,
      explanation:
        "The only official Pi Network website is minepi.com. All other variations are typosquatting scams designed to steal your credentials.",
    },
    {
      question: "A website asks for your 24-word recovery phrase. Is this safe?",
      options: [
        "Yes, if it looks like the official Pi wallet",
        "Only if it has HTTPS",
        "Never - no legitimate service asks for your recovery phrase",
        "Yes, if you trust the sender",
      ],
      correct: 2,
      explanation:
        "Your 24-word recovery phrase should NEVER be shared with anyone or entered on any website. Anyone who has it can steal all your Pi.",
    },
    {
      question: "What is typosquatting?",
      options: [
        "A type of exercise",
        "Creating fake domains that look like real ones (e.g., minepi.com → minepj.com)",
        "A security feature in Pi Browser",
        "A way to earn more Pi",
      ],
      correct: 1,
      explanation:
        "Typosquatting is when scammers register domains with slight misspellings of legitimate sites to trick users. Always double-check the exact URL.",
    },
    {
      question: "You see a site offering to 'unlock your Pi tokens faster'. What is this?",
      options: ["A helpful service", "Official Pi Network feature", "A scam trying to steal your wallet", "Legitimate"],
      correct: 2,
      explanation:
        "There is no way to 'unlock Pi tokens faster'. These sites are phishing scams designed to steal your passphrase and drain your wallet.",
    },
  ]

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowAnswer(true)

    if (answerIndex === quizQuestions[currentQuestion].correct) {
      setQuizScore(quizScore + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowAnswer(false)
    } else {
      setQuizCompleted(true)
    }
  }

  const handleRestart = () => {
    setQuizScore(0)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setQuizCompleted(false)
    setShowAnswer(false)
  }

  const scamPatterns = [
    {
      icon: Lock,
      title: "Fake Wallet Sites",
      description: "Sites that mimic wallet.pi.net to steal your passphrase",
      redFlags: ["Slightly different URL", "Asks for 24-word phrase", "Poor spelling/grammar"],
      example: "wallet-pi.net, pi-wallet.net (Real: wallet.pi.net)",
    },
    {
      icon: AlertTriangle,
      title: "Airdrop Scams",
      description: "Promises of free Pi tokens in exchange for credentials",
      redFlags: ["Too good to be true offers", "Urgency tactics", "Requires wallet login"],
      example: "Claim 628 Pi for Pi2Day! (Fake celebration)",
    },
    {
      icon: Link2,
      title: "Phishing Messages",
      description: "Direct messages claiming to be from Pi Network support",
      redFlags: ["Asks for passphrase", "Unsolicited contact", "Creates urgency"],
      example: "Your account will be deleted unless you verify now",
    },
    {
      icon: Eye,
      title: "Fake Exchanges",
      description: "Fraudulent sites offering to trade Pi tokens",
      redFlags: ["Not on official list", "Requires deposit first", "Unrealistic prices"],
      example: "Trade Pi for 10x market value! (Too good to be true)",
    },
  ]

  const bestPractices = [
    {
      icon: CheckCircle,
      title: "Always verify URLs",
      description: "Double-check you're on the real minepi.com or wallet.pi.net",
    },
    {
      icon: CheckCircle,
      title: "Never share your passphrase",
      description: "Your 24-word recovery phrase should be kept completely private",
    },
    {
      icon: CheckCircle,
      title: "Enable two-factor authentication",
      description: "Add an extra layer of security to your Pi Network account",
    },
    {
      icon: CheckCircle,
      title: "Use Safeπ before clicking",
      description: "Scan links with our tool before visiting suspicious sites",
    },
    {
      icon: CheckCircle,
      title: "Report suspicious activity",
      description: "Help the community by reporting scams you encounter",
    },
    {
      icon: CheckCircle,
      title: "Stay informed",
      description: "Follow official Pi Network channels for security updates",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 bg-blue-500/20 px-4 py-2 rounded-full mb-6">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-semibold text-blue-500">SECURITY EDUCATION CENTER</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              Knowledge Is Your
              <br />
              <span className="text-blue-500">Best Protection</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Learn to spot scams, understand threats, and keep your Pi tokens safe.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Interactive Quiz */}
        <Card className="p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold">Security Knowledge Quiz</h2>
          </div>

          {!quizCompleted ? (
            <>
              <div className="mb-6">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>
                    Question {currentQuestion + 1} of {quizQuestions.length}
                  </span>
                  <span>Score: {quizScore}</span>
                </div>
                <Progress value={((currentQuestion + 1) / quizQuestions.length) * 100} className="h-2" />
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold">{quizQuestions[currentQuestion].question}</h3>

                <div className="space-y-3">
                  {quizQuestions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => !showAnswer && handleAnswer(index)}
                      disabled={showAnswer}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        showAnswer
                          ? index === quizQuestions[currentQuestion].correct
                            ? "border-green-500 bg-green-500/10"
                            : selectedAnswer === index
                              ? "border-red-500 bg-red-500/10"
                              : "border-border bg-muted/50"
                          : selectedAnswer === index
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50 hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5">
                          {showAnswer && index === quizQuestions[currentQuestion].correct && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          {showAnswer &&
                            selectedAnswer === index &&
                            index !== quizQuestions[currentQuestion].correct && (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {showAnswer && (
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg animate-in fade-in slide-in-from-top-2">
                    <div className="flex gap-3">
                      <Lightbulb className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold mb-1">Explanation</p>
                        <p className="text-sm text-muted-foreground">{quizQuestions[currentQuestion].explanation}</p>
                      </div>
                    </div>
                  </div>
                )}

                {showAnswer && (
                  <Button onClick={handleNext} className="w-full">
                    {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "See Results"}
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
              <p className="text-4xl font-bold text-blue-500 mb-4">
                {quizScore} / {quizQuestions.length}
              </p>
              <p className="text-muted-foreground mb-6">
                {quizScore === quizQuestions.length
                  ? "Perfect score! You're a security expert! 🎉"
                  : quizScore >= quizQuestions.length * 0.6
                    ? "Good job! Keep learning to improve your security. 👍"
                    : "Keep studying! Review the patterns below to stay safe. 📚"}
              </p>
              <Button onClick={handleRestart} variant="outline">
                Retake Quiz
              </Button>
            </div>
          )}
        </Card>

        {/* Common Scam Patterns */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold">Common Scam Patterns</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {scamPatterns.map((pattern, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                    <pattern.icon className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{pattern.title}</h3>
                    <p className="text-sm text-muted-foreground">{pattern.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold mb-2">Red Flags:</p>
                    <div className="flex flex-wrap gap-2">
                      {pattern.redFlags.map((flag, i) => (
                        <Badge key={i} variant="destructive" className="text-xs">
                          {flag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs font-semibold mb-1">Example:</p>
                    <p className="text-xs text-muted-foreground">{pattern.example}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Best Practices */}
        <Card className="p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-bold">Security Best Practices</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {bestPractices.map((practice, index) => (
              <div key={index} className="flex gap-3 p-4 rounded-lg bg-muted/50">
                <practice.icon className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">{practice.title}</h3>
                  <p className="text-sm text-muted-foreground">{practice.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Case Studies */}
        <Card className="p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-bold">Real Scam Case Studies</h2>
          </div>

          <div className="space-y-6">
            <div className="border-l-4 border-red-500 pl-6 py-2">
              <h3 className="font-semibold mb-2">The Pi2Day Airdrop Scam (2025)</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Scammers created fake websites 2pidays.net and 2pidays.us claiming to give away 628 Pi tokens for Pi
                Network's "6th birthday." Over 140 Facebook ads promoted this scam.
              </p>
              <Badge variant="destructive">Passphrase Theft</Badge>
              <Badge variant="destructive" className="ml-2">
                Social Media Campaign
              </Badge>
            </div>

            <div className="border-l-4 border-red-500 pl-6 py-2">
              <h3 className="font-semibold mb-2">Fake Wallet Phishing (Ongoing)</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Sites like wallet-pi.net and pi-wallet.net clone the official wallet interface. Users enter their
                24-word phrase thinking they're on wallet.pi.net, and scammers drain their accounts instantly.
              </p>
              <Badge variant="destructive">URL Spoofing</Badge>
              <Badge variant="destructive" className="ml-2">
                Credential Theft
              </Badge>
            </div>

            <div className="border-l-4 border-red-500 pl-6 py-2">
              <h3 className="font-semibold mb-2">Fake DEX Trading Sites (2025)</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Fraudulent decentralized exchanges like minepidex.com promised to trade Pi tokens at inflated prices.
                Users sent Pi but never received anything in return.
              </p>
              <Badge variant="destructive">Fake Exchange</Badge>
              <Badge variant="destructive" className="ml-2">
                Deposit Theft
              </Badge>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-600">
            <a href="/">← Back to Scanner</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
