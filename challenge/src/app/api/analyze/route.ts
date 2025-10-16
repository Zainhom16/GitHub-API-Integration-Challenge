import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username } = await req.json();
    if (!username) {
      return NextResponse.json(
        { message: "Missing username" },
        { status: 400 }
      );
    }

    const userRes = await fetch(`https://api.github.com/users/${username}`);
    if (!userRes.ok) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const user = await userRes.json();

    const repoRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=10&sort=updated`
    );
    const repos = repoRes.ok ? await repoRes.json() : [];

    const languages = [
      ...new Set(repos.map((r: any) => r.language).filter(Boolean)),
    ];
    const topRepos = repos.slice(0, 5).map((r: any) => r.name);

    const prompt = `
    You are a professional technical recruiter and GitHub profile analyst.
    Analyze this developer's GitHub profile and describe their technical expertise,
    experience level, and main development focus in 2–3 professional paragraphs.

    Name: ${user.name || "Not provided"}
    Username: ${user.login}
    Bio: ${user.bio || "No bio provided"}
    Public Repos: ${user.public_repos}
    Followers: ${user.followers}
    Following: ${user.following}
    Languages: ${languages.join(", ") || "Not specified"}
    Top Repositories: ${topRepos.join(", ")}
    `;

    const openRouterRes = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "GitHub Profile Analyzer",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages: [
            {
              role: "system",
              content: "You are an expert GitHub profile analyst.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      }
    );

    if (!openRouterRes.ok) {
      const errText = await openRouterRes.text();
      console.error("OpenRouter error:", errText);

      let errJson: any = null;
      try {
        errJson = JSON.parse(errText);
      } catch {}

      return NextResponse.json(
        { message: errJson?.error?.message || "Model error" },
        { status: openRouterRes.status }
      );
    }

    const data = await openRouterRes.json();
    const analysis =
      data.choices?.[0]?.message?.content || "No analysis generated.";

    return NextResponse.json({ analysis });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { message: "Unexpected error occurred." },
      { status: 500 }
    );
  }
}
