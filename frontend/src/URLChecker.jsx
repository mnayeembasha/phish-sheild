import { useState } from "react";
import { Shield, AlertCircle, Check, Loader2, ShieldCheck, Globe, AlertTriangle, XCircle } from "lucide-react";
import { useToast } from "../src/hooks/use-toast.js";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Card } from "./components/ui/card";
import axios from "axios";
import { BACKEND_URL } from "./config.js";

export const URLChecker = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validateURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const checkURL = async () => {
    if (!url) {
      toast({
        title: "Please enter a URL",
        description: "The URL field cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (!validateURL(url)) {
      toast({
        title: "Invalid URL format",
        description: "Please enter a valid URL including http:// or https://",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/check-url`, { url });
      setResult(response.data);
      toast({
        title: response.data.isPhishing ? "Warning: Potential Threat Detected" : "URL Verified Safe",
        description: response.data.isPhishing
          ? "This URL shows signs of being a phishing attempt."
          : "This URL appears to be safe.",
        variant: response.data.isPhishing ? "destructive" : "default",
      });
    } catch (error) {
      console.error("Error checking URL", error);
      toast({
        title: "Error",
        description: "Failed to check the URL. Please try again later.",
        variant: "destructive",
      });
      setResult({ error: "Failed to check the URL. Try again later." });
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      checkURL();
    }
  };

  return (
    <Card className="w-full rounded-xl border-none">
      <div className="space-y-6">
        <div className="flex flex-wrap justify-center items-center gap-4 border-none">
          <Input
            type="url"
            placeholder="Enter URL to check (e.g., https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            className="h-12 text-base border-gray-50/50 focus:border-none hover:border-none"
            disabled={loading}
          />
          <Button
            onClick={checkURL}
            disabled={loading}
            className="flex justify-between h-12 px-6 w-full md:min-w-[120px]  bg-gradient-to-b from-blue-400 to-blue-700 hover:opacity-70 font-semibold text-white"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Shield className="h-4 w-4 font-extrabold" />
            )}
            {loading ? "Checking" : "Check URL"}
          </Button>
        </div>

        {result && !loading && (
          <div
            className={`p-4 rounded-lg transition-all duration-300 animate-fadeIn ${
              result.error
                ? "bg-gray-70 border border-orange-200"
                : result.isPhishing
                ? "bg-gray-70 border border-red-200"
                : "bg-gray-70 border border-green-200"
            }`}
          >
            <div
              className={`flex items-center gap-2 text-base font-medium ${
                result.error
                  ? "text-orange-700"
                  : result.isPhishing
                  ? "text-red-700"
                  : "text-green-700"
              }`}
            >
              {result.error ? (
                <AlertCircle className="h-5 w-5" />
              ) : result.isPhishing ? (
                <AlertCircle className="h-5 w-5" />
              ) : (
                <Check className="h-5 w-5" />
              )}
              {result.error
                ? result.error
                : result.isPhishing
                ? "Warning: Potential phishing URL detected!"
                : "URL verified as safe"
              }

            </div>

             {/* Additional Information */}
  {!result.error && <div className="flex flex-col gap-y-3 mt-3">
    {/* SSL Status */}
    <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-800/20">
      <ShieldCheck className="h-5 w-5 text-blue-500" />
      <span className="text-sm font-medium text-gray-200">
        SSL : <span className="text-gray-500">{result.sslStatus}</span>
      </span>
    </div>

    {/* Safe Browsing Check */}
      <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-800/20">
        <Globe className="h-5 w-5 text-purple-500" />
        <span className="text-sm font-medium text-gray-200">
          Safe Browsing :  <span className="text-gray-500">  {result.safeBrowsing}</span>
        </span>
      </div>

    {/* Final Verdict */}
    <div
      className={`flex items-center gap-2 p-3 border rounded-lg ${
        result.isPhishing ? "bg-red-200 text-red-700" : "bg-green-200 text-green-700"
      }`}
    >
      {result.isPhishing ? <AlertTriangle className="h-5 w-5" /> : <Check className="h-5 w-5" />}
      <span className="text-sm font-medium">
        Final Verdict : {result.isPhishing ? <span className="">Phishing Detected</span> : "✅ Safe"}
      </span>
    </div>
  </div>}
          </div>
        )}
      </div>
    </Card>
  );
};
